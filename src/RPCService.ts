import path from 'path';
import { ClientReadableStream, credentials, GrpcObject, loadPackageDefinition, Metadata } from '@grpc/grpc-js';
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client';
import { loadSync } from '@grpc/proto-loader';
import { createLogger } from './utils/logger';
import { DataEntryRequest, DataEntryResponse, TxType } from './interfaces';
import { CONNECTION_ID, CONNECTION_TOKEN, NODE, NODE_PORT, HOST_NETWORK } from './config';
import { wavesenterprise } from './compiled-protos';

import IContractTransactionResponse = wavesenterprise.IContractTransactionResponse

const logger = createLogger('GRPC service');

const DATA_ENTRY_PROTO = path.resolve(__dirname, 'protos', 'data_entry.proto');
const CONTRACT_PROTO = path.resolve(__dirname, 'protos', 'contract.proto');

const definitions = loadSync(
  [DATA_ENTRY_PROTO, CONTRACT_PROTO],
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const proto = loadPackageDefinition(definitions).wavesenterprise as GrpcObject;
const ContractService = proto.ContractService as ServiceClientConstructor;

const IncrementContractKey = 'key_increment'

export class RPCService {
  client: any;

  constructor() {
    logger.info(`
      Init RPC service with params:
      CONNECTION_ID: ${CONNECTION_ID}
      CONNECTION_TOKEN: ${CONNECTION_TOKEN}
      NODE: ${NODE}
      NODE_PORT: ${NODE_PORT}
      HOST_NETWORK: ${HOST_NETWORK}
    `);
    this.client = new ContractService(`${NODE}:${NODE_PORT}`, credentials.createInsecure());
  }

  getContractKey(auth: Metadata, contractId: string, key: string): Promise<{ entry: DataEntryResponse }> {
    return new Promise((resolve, reject) => {
      this.client.getContractKey({
        contract_id: contractId,
        key,
      }, auth, function (error: Error, response: { entry: DataEntryResponse }) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async getContractKeyValue<R extends string | boolean | Buffer>(auth: Metadata, contractId: string, key: string): Promise<R> {
    const { entry } = await this.getContractKey(auth, contractId, key);
    return entry[entry.value] as R;
  }

  commitSuccess = (auth: Metadata, txId: string, results: DataEntryRequest[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.client.commitExecutionSuccess({
        tx_id: txId,
        results,
      }, auth, function (error: Error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };

  commitError(auth: Metadata, txId: string, message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.commitExecutionError({
        tx_id: txId,
        message,
      }, auth, function (error: Error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  onDataReceived = async (response: IContractTransactionResponse) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { transaction: tx, auth_token } = response;

    const auth = new Metadata();
    auth.set('authorization', auth_token);

    const txId = tx!.id as string;
    const txParams = tx!.params;
    // For node version 1.5
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const contractId = tx!.contract_id as string;

    logger.info(`Transaction ${tx!.type} income: ${txId} params: ${JSON.stringify(txParams)}`);
    const start = Date.now();

    try {
      switch(tx!.type) {
        case TxType.DockerCreate:
          await this.commitSuccess(auth, txId, [{
            key: IncrementContractKey,
            string_value: '0'
          }]);
          logger.info(`Contract ${txId} mined, time: ${Date.now() -  start}ms`);
          break;
        case TxType.DockerCall: {
          const value: string = await this.getContractKeyValue(auth, contractId, IncrementContractKey);
          logger.info(`Contract ${contractId} key value ${value}`);
          const results = [{
            key: IncrementContractKey,
            type: 'string',
            string_value: (parseInt(value) + 1).toString()
          }];
          await this.commitSuccess(auth, txId, results);
          logger.info(`Contract ${txId} mined, time: ${Date.now() -  start}ms`);
          break;
        }
      }
    } catch(e) {
      logger.info(`Tx error: ${e.message}`);
      await this.commitError(auth, txId, e.message);
    }
  }

  connect() {
    const connectionMeta = new Metadata();
    connectionMeta.set('authorization', CONNECTION_TOKEN);
    const connection: ClientReadableStream<IContractTransactionResponse> = this.client.connect({
      connection_id: CONNECTION_ID,
    }, connectionMeta);
    connection.on('data', this.onDataReceived);
    connection.on('close', () => {
      logger.info('Connection stream closed');
    });
    connection.on('end', () => {
      logger.info('Connection stream ended');
    });
    connection.on('error', (error) => {
      logger.info(`Connection stream error: ${error}`);
    });
    connection.on('readable', () => {
      logger.info('Connection stream readable');
      connection.read();
    });
    connection.on('pause', () => {
      logger.info('Connection stream paused');
    });
    connection.on('resume', () => {
      logger.info('Connection stream resumed');
    });
    logger.info('Connection created');
  }
}
