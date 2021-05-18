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
  TxType,
  BurnParam,
  TransferParam,
  Vault,
  TransferTx,
  RecalculateParam,
  MintParam,
  LiquidateParam,
  Oracle,
  SupplyParam,
  ConfigParam
} from '../interfaces';
import { CONNECTION_ID, CONNECTION_TOKEN, NODE, NODE_PORT, HOST_NETWORK } from '../config';
import { StateService } from './StateService';


const logger = createLogger('GRPC service');

const CONTRACT_PROTO = path.resolve(__dirname, '../protos', 'contract.proto');
const TRANSACTIONS_PROTO = path.resolve(__dirname, '../protos', 'transactions.proto')
const PROTO_DIR = path.join(__dirname, '../protos')


const definitions = loadSync(
  [TRANSACTIONS_PROTO, CONTRACT_PROTO],
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [PROTO_DIR],
  },
);

const proto = loadPackageDefinition(definitions).wavesenterprise as GrpcObject;
const ContractService = proto.ContractService as ServiceClientConstructor;
const TransactionService = proto.TransactionService as ServiceClientConstructor;

// CONSTS
const WEST_DECIMALS = 8
const WEST_ORACLE_STREAM = '000003_latest'
const USDP_ORACLE_STREAM = '000010_latest'

export class RPCService {
  // eslint-disable-next-line
  client: any;
  txClient: any;
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
    this.txClient = new TransactionService(`${NODE}:${NODE_PORT}`, credentials.createInsecure());

    this.stateService = new StateService(this.client, this.txClient);
  }

  checkConfigFieldType(config: any, field: string, type: string) {
    if (!config[field] && typeof config[field] !== type)  {
      throw new Error(`Config error: ${field} expected to be a ${type}, received: ${config[field]}`);
    }
  }

  checkConfig(config: ConfigParam)  {
    if (!config) {
      throw new Error(`Config error: confid undefined: ${config}`);
    }
    this.checkConfigFieldType(config, 'oracleContractId', 'string');
    this.checkConfigFieldType(config, 'oracleTimestampMaxDiff', 'number');
    this.checkConfigFieldType(config, 'usdpPart', 'number');
    this.checkConfigFieldType(config, 'westCollateral', 'number');
    this.checkConfigFieldType(config, 'liquidationCollateral', 'number');
    this.checkConfigFieldType(config, 'minHoldTime', 'number');
    this.checkConfigFieldType(config, 'USDapTokenId', 'string');
  }

  async handleDockerCreate(tx: Transaction): Promise<void> {
    const paramConfig = tx.params[0];
    const config = JSON.parse(paramConfig.string_value || '{}');
    this.checkConfig(config);
    config.adminAddress = tx.sender;
    config.adminPublicKey = tx.sender_public_key;
    await this.stateService.commitSuccess(tx.id, [
      {
        key: StateKeys.config,
        string_value: JSON.stringify(config)
      }, 
      {
        key: StateKeys.totalSupply,
        string_value: '0'
      }
    ]);
  }

  async checkAdminPermissions(tx: Transaction): Promise<void> {
    const { adminPublicKey } = await this.stateService.getConfig();
    if (!adminPublicKey) {
      throw new Error('Admin public key is missing in state');
    }
    if (adminPublicKey !== tx.sender_public_key) {
      throw new Error(`Creator public key ${adminPublicKey} doesn't match tx sender public key ${tx.sender_public_key}`);
    }
  }

  async getLastOracles(oracleTimestampMaxDiff: number, oracleContractId: string) : Promise<{ westRate: Oracle, usdpRate: Oracle }> {
    const westRate = JSON.parse(await this.stateService.getContractKeyValue(WEST_ORACLE_STREAM, oracleContractId))
    const usdpRate = JSON.parse(await this.stateService.getContractKeyValue(USDP_ORACLE_STREAM, oracleContractId))

    const westTimeDiff = Date.now() - westRate.timestamp
    const usdpTimeDiff = Date.now() - usdpRate.timestamp

    if (westTimeDiff > oracleTimestampMaxDiff || usdpTimeDiff > oracleTimestampMaxDiff) {
      throw new Error(`Too big difference in milliseconds between oracle_data.timestamp and current timestamp: 
        westRate: ${JSON.stringify(westRate)}, usdpRate: ${JSON.stringify(usdpRate)}, ${westTimeDiff}, ${usdpTimeDiff}, ${oracleTimestampMaxDiff}`)
    }
    return { westRate, usdpRate }
  }

  async calculateVault(inputWestAmount: number): Promise<{
    eastAmount: number,
    usdpAmount: number,
    westAmount: number,
    westRateTimestamp: number,
    usdpRateTimestamp: number
  }> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      usdpPart,
      westCollateral
    } = await this.stateService.getConfig()
    
    // mock
    // const westRate = {value: 0.34, timestamp: Date.now()}, usdpRate = {value: 1, timestamp: Date.now()}
    const { westRate, usdpRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const usdpPartInPosition = usdpPart / ((1 - usdpPart) * westCollateral + usdpPart)
    const transferAmount = parseFloat(inputWestAmount + '') / Math.pow(10, WEST_DECIMALS)
    const westToUsdpAmount = usdpPartInPosition * transferAmount
    const eastAmount = (westToUsdpAmount * westRate.value) / usdpPart
    const usdpAmount = westToUsdpAmount * westRate.value / usdpRate.value

    return {
      eastAmount,
      usdpAmount,
      westAmount: transferAmount - westToUsdpAmount,
      westRateTimestamp: Number(westRate.timestamp),
      usdpRateTimestamp: Number(usdpRate.timestamp)
    }
  }

  async recalculateVault(oldVault: Vault): Promise<{
    eastAmount: number,
    usdpAmount: number,
    westAmount: number,
    westRateTimestamp: number,
    usdpRateTimestamp: number
  } | false> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      usdpPart,
      westCollateral
    } = await this.stateService.getConfig();
    
    // mock
    // const westRate = {value: 0.68, timestamp: Date.now()}, usdpRate = {value: 1, timestamp: Date.now()}
    const { westRate, usdpRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const {
      eastAmount: oldEastAmount,
      usdpAmount: oldUsdpAmount,
      westAmount: oldWestAmount
    } = oldVault;

    const usdTotal = oldUsdpAmount * usdpRate.value + oldWestAmount * westRate.value
    const usdpPartInPosition = usdpPart / ((1 - usdpPart) * westCollateral + usdpPart)
    const usdToUsdpAmount = usdpPartInPosition * usdTotal
    const usdpAmount = usdToUsdpAmount / usdpRate.value
    const eastAmount = usdpAmount / usdpPart
    const westAmount = (usdTotal - usdToUsdpAmount) / westRate.value

    if (eastAmount > oldEastAmount) {
      return {
        eastAmount,
        usdpAmount,
        westAmount,
        westRateTimestamp: Number(westRate.timestamp),
        usdpRateTimestamp: Number(usdpRate.timestamp)
      }
    } else {
      return false;
    }
  }

  // returns amount
  async checkTransfer(tx: Transaction, transferId: string): Promise<number> {
    const {
      sender_public_key: senderPubKey,
      amount: transferAmount,
      recipient
    } = await this.stateService.getTransactionInfoOrFail<TransferTx>(transferId);

    const { adminAddress } = await this.stateService.getConfig();
    if (!adminAddress) {
      throw new Error('Admin public key is missing in state');
    }

    if (adminAddress !== recipient) {
      throw new Error('Transfer recipient are not admin');
    }

    if (tx.sender_public_key !== senderPubKey) {
      throw new Error(`Sender public key are not equal for transfer and docker call.`);
    }
    
    const isTransferUsed = await this.stateService.isTransferUsed(transferId)
    if (isTransferUsed) {
      throw new Error(`Transfer ${transferId} is already used for accounting`);
    }

    return transferAmount
  }

  async mint(tx: Transaction, { transferId }: MintParam): Promise<DataEntryRequest[]> {
    const transferAmount = await this.checkTransfer(tx, transferId)
    const address = tx.sender;
    
    const vault = await this.calculateVault(transferAmount) as Vault
    vault.address = address

    let totalSupply = await this.stateService.getTotalSupply();
    let balance = await this.stateService.getBalance(address);
    balance += vault.eastAmount;
    totalSupply += vault.eastAmount;
    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + totalSupply
      },
      {
        key: `${StateKeys.balance}_${address}`,
        string_value: '' + balance
      },
      {
        key: `${StateKeys.vault}_${tx.id}`,
        string_value: JSON.stringify(vault)
      },
      {
        key: `${StateKeys.exchange}_${transferId}`,
        bool_value: true
      }
    ];
  }

  async recalculate(tx: Transaction, { vaultId }: RecalculateParam): Promise<DataEntryRequest[]> {
    const oldVault = await this.stateService.getVault(vaultId);
    const address = tx.sender;

    if (oldVault.address !== tx.sender) {
      throw new Error(`Only vault owner cat recaculate vault`);
    }
    const newVault = await this.recalculateVault(oldVault)

    if (!newVault) {
      throw new Error(`Cannot increase east amount`);
    }

    let totalSupply = await this.stateService.getTotalSupply();
    let balance = await this.stateService.getBalance(oldVault.address);
    const diff = newVault.eastAmount - oldVault.eastAmount;

    balance += diff;
    totalSupply += diff;

    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + totalSupply
      },
      {
        key: `${StateKeys.balance}_${address}`,
        string_value: '' + balance
      },
      {
        key: `${StateKeys.vault}_${vaultId}`,
        string_value: JSON.stringify({
          ...newVault,
          address
        })
      }
    ];
  }

  async burnInit(tx: Transaction, { vaultId }: BurnParam): Promise<DataEntryRequest[]> {
    const { address } = await this.stateService.getVault(vaultId);
    const { minHoldTime } = await this.stateService.getConfig();

    // check minimum hold time
    const { timestamp } = await this.stateService.getTransactionInfoOrFail<TransferTx>(vaultId);
    const holdTime = Date.now() - (new Date(timestamp).getTime());
    if (holdTime < minHoldTime) {
      throw new Error(`Only ${address} can burn vault ${vaultId}`);
    }
    // check
    if (tx.sender !== address) {
      throw new Error(`Only ${address} can burn vault ${vaultId}`);
    }
    return []
  }

  async burn(tx: Transaction, { vaultId }: BurnParam): Promise<DataEntryRequest[]> {
    // only contract creator allowed
    await this.checkAdminPermissions(tx);

    const { eastAmount, address } = await this.stateService.getVault(vaultId);

    let totalSupply = await this.stateService.getTotalSupply();
    let balance = await this.stateService.getBalance(address);

    // check balance
    if (balance < eastAmount) {
      throw new Error(`Not enought EAST amount(${eastAmount}) on ${address} to burn vault: ${vaultId}`);
    }

    balance -= eastAmount;
    totalSupply -= eastAmount;

    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + Math.max(totalSupply, 0)
      }, 
      {
        key: `${StateKeys.balance}_${address}`,
        string_value: '' + Math.max(balance, 0)
      },
      {
        key: `${StateKeys.vault}_${vaultId}`,
        string_value: ''
      }
    ];
  }

  async transfer(tx: Transaction, value: TransferParam): Promise<DataEntryRequest[]> {
    const { to, eastAmount: amount } = value
    const from = tx.sender

    let fromBalance = await this.stateService.getBalance(from);
    if(fromBalance < amount) {
      throw new Error(`Insufficient funds to transfer from "${from}": balance "${fromBalance}", amount "${amount}"`);
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

  async liquidate(tx: Transaction, { vaultId }: LiquidateParam): Promise<DataEntryRequest[]> {
    // only contract creator allowed
    await this.checkAdminPermissions(tx);
    const { eastAmount, westAmount, address } = await this.stateService.getVault(vaultId);
    const { 
      oracleContractId,
      usdpPart,
      liquidationCollateral 
    } = await this.stateService.getConfig();
    
    const westRate = JSON.parse(await this.stateService.getContractKeyValue(WEST_ORACLE_STREAM, oracleContractId));
    // mock
    // const westRate = { value: 0.1, timestamp: Date.now() }

    const westPart = 1 - usdpPart;
    const currentWestCollateral = (westAmount * westRate.value) / (westPart * eastAmount);

    if (currentWestCollateral > liquidationCollateral) {
      throw new Error(`Cannot liquidate vault ${vaultId}, currentWestCollateral: ${currentWestCollateral}, liquidationCollateral: ${liquidationCollateral}`);
    }

    const liquidatedVault = {
      eastAmount,
      usdpAmount: eastAmount,
      address,
      liquidated: true,
      westRateTimestamp: Number(westRate.timestamp)
    }

    return [
      {
        key: `${StateKeys.vault}_${vaultId}`,
        string_value: JSON.stringify(liquidatedVault)
      }
    ];
  }

  async supply(tx: Transaction, { transferId, vaultId }: SupplyParam): Promise<DataEntryRequest[]> {
    const vault = await this.stateService.getVault(vaultId);
    const transferAmount = await this.checkTransfer(tx, transferId);
    vault.westAmount = vault.westAmount + (Number(transferAmount) / Math.pow(10, WEST_DECIMALS));

    return [
      {
        key: `${StateKeys.vault}_${vaultId}`,
        string_value: JSON.stringify(vault)
      },
      {
        key: `${StateKeys.exchange}_${transferId}`,
        bool_value: true
      }
    ];
  }

  async updateConfig(tx: Transaction, newConfig: Partial<ConfigParam>): Promise<DataEntryRequest[]> {
    await this.checkAdminPermissions(tx);
    const oldConfig = await this.stateService.getConfig();

    const config = {
      ...oldConfig,
      ...newConfig
    }
    this.checkConfig(config);

    return [
      {
        key: StateKeys.config,
        string_value: JSON.stringify(config)
      }
    ];
  }
  async handleDockerCall(tx: Transaction): Promise<void> {
    const { params } = tx;
    let results: DataEntryRequest[] = [];

    // TODO: iterate params
    const param = params[0] || {};
    if (param) {
      const value = JSON.parse(param.string_value || '{}');
      switch(param.key) {
        case Operations.update_config:
          results = await this.updateConfig(tx, value);
          break;
        case Operations.mint:
          results = await this.mint(tx, value);
          break;
        case Operations.transfer:
          results = await this.transfer(tx, value);
          break;
        case Operations.recalculate:
          results = await this.recalculate(tx, value);
          break;
        case Operations.burn_init:
          results = await this.burnInit(tx, value);
          break;
        case Operations.burn:
          results = await this.burn(tx, value);
          break;
        case Operations.supply:
          results = await this.supply(tx, value);
          break;
        case Operations.liquidate:
          results = await this.liquidate(tx, value);
          break;
        default:
          throw new Error(`Unknown DockerCall operation key: "${param.key}"`);
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

    const connection: ClientReadableStream<any> = this.client.connect({
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
