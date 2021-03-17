import path from 'path';
import { ClientReadableStream, credentials, GrpcObject, loadPackageDefinition, Metadata } from '@grpc/grpc-js';
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client';
import { loadSync } from '@grpc/proto-loader';
import { createLogger } from '../utils/logger';
import {
  ContractTransactionResponse,
  DataEntryRequest,
  Operations,
  StateKeys,
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

export class RPCService {
  // eslint-disable-next-line
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

  async handleDockerCreate(tx: Transaction): Promise<void> {
    await this.stateService.commitSuccess(tx.id, [{
      key: StateKeys.adminPublicKey,
      string_value: tx.sender_public_key
    }, {
      key: StateKeys.totalSupply,
      string_value: '0'
    }]);
  }

  async checkPermissions(tx: Transaction): Promise<void> {
    const adminPublicKey = await this.stateService.getContractKeyValue(StateKeys.adminPublicKey);
    if (!adminPublicKey) {
      throw Error('Admin public key is missing in state');
    }
    if (adminPublicKey !== tx.sender_public_key) {
      throw Error(`Creator public key ${adminPublicKey} doesn't match tx sender public key ${tx.sender_public_key}`);
    }
  }

  async mint(address: string, amount: number): Promise<DataEntryRequest[]> {
    let totalSupply = await this.stateService.getTotalSupply();
    let balance = await this.stateService.getBalance(address);
    balance += amount;
    totalSupply += amount;
    return [{
      key: StateKeys.totalSupply,
      string_value: '' + totalSupply
    }, {
      key: `${StateKeys.balance}_${address}`,
      string_value: '' + balance
    }];
  }

  async burn(address: string, amount: number): Promise<DataEntryRequest[]> {
    let totalSupply = await this.stateService.getTotalSupply();
    let balance = await this.stateService.getBalance(address);
    balance -= amount;
    totalSupply -= amount;
    return [{
      key: StateKeys.totalSupply,
      string_value: '' + Math.max(totalSupply, 0)
    }, {
      key: `${StateKeys.balance}_${address}`,
      string_value: '' + Math.max(balance, 0)
    }];
  }

  async transfer(from: string, to: string, amount: number): Promise<DataEntryRequest[]> {
    let fromBalance = await this.stateService.getBalance(from);

    if(fromBalance < amount) {
      throw Error(`Insufficient funds to transfer from "${from}": balance "${fromBalance}", amount "${amount}"`);
    }

    let toBalance = await this.stateService.getBalance(to);

    fromBalance -= amount;
    toBalance += amount;
    return [{
      key: `${StateKeys.balance}_${from}`,
      string_value: '' + fromBalance
    }, {
      key: `${StateKeys.balance}_${to}`,
      string_value: '' + toBalance
    }];
  }

  async handleDockerCall(tx: Transaction): Promise<void> {
    const { params } = tx;
    let results: DataEntryRequest[] = [];

    logger.info(`PARAMS: ${JSON.stringify(params)}`);

    // TODO: iterate params
    const param = params[0];
    if (param) {
      const value = JSON.parse(param.string_value || '{}');
      switch(param.key) {
        case Operations.mint: {
          await this.checkPermissions(tx);
          results = await this.mint(value.address, Number(value.amount));
        }
        break;
        case Operations.transfer: {
          results = await this.transfer(tx.sender, value.to, value.amount);
        }
        break;
        case Operations.burn: {
          results = await this.burn(tx.sender, Number(value.amount));
        }
        break;
        default:
          throw Error(`Unknown DockerCall operation key: "${param.key}"`);
      }
    }

    await this.stateService.commitSuccess(tx.id, results);
  }

  onDataReceived = async (response: ContractTransactionResponse): Promise<void> => {
    const { transaction: tx, auth_token } = response;

    const auth = new Metadata();
    auth.set('authorization', auth_token);

    this.stateService.setAuthData(auth, tx.contract_id);

    logger.info(`Transaction ${tx.type} income: ${tx.id}, data: ${JSON.stringify(tx)}`);
    const start = Date.now();

    try {
      switch(tx.type) {
        case TxType.DockerCreate:
          await this.handleDockerCreate(tx);
          break;
        case TxType.DockerCall:
          await this.handleDockerCall(tx);
          break;
      }
      logger.info(`Tx "${tx.id}" (type ${tx.type}) successfully mined, elapsed time: ${Date.now() -  start}ms`);
    } catch(e) {
      logger.info(`Tx "${tx.id}" (type ${tx.type}) error: ${e.message}`);
      await this.stateService.commitError(tx.id, e.message);
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
