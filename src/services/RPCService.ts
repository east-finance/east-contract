import path from 'path';
import { ClientReadableStream, credentials, GrpcObject, loadPackageDefinition, Metadata } from '@grpc/grpc-js';
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client';
import { loadSync } from '@grpc/proto-loader';
import { createLogger } from '../utils/logger';
import {
  ContractKeys,
  ContractTransactionResponse,
  DataEntryRequest,
  Transaction,
  TxType
} from '../interfaces';
import { CONNECTION_ID, CONNECTION_TOKEN, NODE, NODE_PORT, HOST_NETWORK } from '../config';
import { wavesenterprise } from '../compiled-protos';
import { StateService } from './StateService';

import IContractTransactionResponse = wavesenterprise.IContractTransactionResponse

const logger = createLogger('GRPC service');

const DATA_ENTRY_PROTO = path.resolve(__dirname, '../protos', 'data_entry.proto');
const CONTRACT_PROTO = path.resolve(__dirname, '../protos', 'contract.proto');

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

const IncrementContractKey = 'key_increment';

export class RPCService {
  client: any;
  private stateService: StateService;

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
    this.stateService = new StateService(this.client);
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

  async handleDockerCreate(auth: Metadata, tx: Transaction): Promise<void> {
    await this.commitSuccess(auth, tx.id, [{
      key: IncrementContractKey,
      string_value: '0'
    }, {
      key: ContractKeys.CreatorPublicKey,
      string_value: tx.sender_public_key
    }]);
  }

  async checkPermissions(auth: Metadata, tx: Transaction): Promise<void> {
    const creatorPublicKey = await this.stateService.getContractKeyValue(auth, tx.contract_id, ContractKeys.CreatorPublicKey);
    if (!creatorPublicKey) {
      throw Error('Creator public key is missing in state');
    }
    if (creatorPublicKey !== tx.sender_public_key) {
      throw Error(`Creator public key ${creatorPublicKey} doesn't match tx sender public key ${tx.sender_public_key}`);
    }
  }

  async handleDockerCall(auth: Metadata, tx: Transaction): Promise<void> {
    await this.checkPermissions(auth, tx);
    const value: string = await this.stateService.getContractKeyValue(auth, tx.contract_id, IncrementContractKey);
    const results = [{
      key: IncrementContractKey,
      type: 'string',
      string_value: (parseInt(value) + 1).toString()
    }];
    await this.commitSuccess(auth, tx.id, results);
  }

  onDataReceived = async (response: ContractTransactionResponse): Promise<void> => {
    const { transaction: tx, auth_token } = response;

    const auth = new Metadata();
    auth.set('authorization', auth_token);

    logger.info(`Transaction ${tx.type} income: ${tx.id}, data: ${JSON.stringify(tx)}`);
    const start = Date.now();

    try {
      switch(tx.type) {
        case TxType.DockerCreate:
          await this.handleDockerCreate(auth, tx);
          break;
        case TxType.DockerCall:
          await this.handleDockerCall(auth, tx);
          break;
      }
      logger.info(`Contract ${tx.id} with tx type ${tx.type} mined, time: ${Date.now() -  start}ms`);
    } catch(e) {
      logger.info(`Tx error: ${e.message}`);
      await this.commitError(auth, tx.id, e.message);
    }
  }

  connect(): void {
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
