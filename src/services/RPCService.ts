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
  CloseParam,
  TransferParam,
  Vault,
  TransferTx,
  LiquidateParam,
  MintParam,
  Oracle,
  SupplyParam,
  ConfigParam,
  ClaimOverpayParam,
  ReissueParam
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
const MINIMUM_TRANSFER = 0.1
const CLAIN_OVERPAY_COMISSION = 0.2
const CLOSE_COMISSION = 0.3


function roundValue(num: number) {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  return +num.toFixed(WEST_DECIMALS);
}

function parseValue(num: number) {
  return parseFloat(num + '') / Math.pow(10, WEST_DECIMALS)
}

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
    const defaultVals = {
      issueEnabled: true
    }
    const paramConfig = tx.params[0];
    const config = JSON.parse(paramConfig.string_value || '{}');
    this.checkConfig(config);
    config.adminAddress = tx.sender;
    config.adminPublicKey = tx.sender_public_key;
    await this.stateService.commitSuccess(tx.id, [
      {
        key: StateKeys.config,
        string_value: JSON.stringify({
          ...defaultVals,
          ...config
        })
      }, 
      {
        key: StateKeys.totalSupply,
        string_value: '0'
      }, 
      {
        key: StateKeys.totalUsdap,
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

  async calculateVault(transferAmount: number): Promise<{
    eastAmount: number,
    usdpAmount: number,
    westAmount: number,
    westRate: Oracle,
    usdpRate: Oracle
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
    const westToUsdpAmount = usdpPartInPosition * transferAmount
    const eastAmount = (westToUsdpAmount * westRate.value) / usdpPart
    const usdpAmount = westToUsdpAmount * westRate.value / usdpRate.value

    return {
      eastAmount: roundValue(eastAmount),
      usdpAmount: roundValue(usdpAmount),
      westAmount: roundValue(transferAmount - westToUsdpAmount),
      westRate,
      usdpRate
    }
  }

  async exchangeWest(westToUsdpAmount: number): Promise<{
    eastAmount: number,
    usdpAmount: number,
    westRate: Oracle,
    usdpRate: Oracle
  }> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      usdpPart
    } = await this.stateService.getConfig()
    
    // mock
    // const westRate = {value: 0.34, timestamp: Date.now()}, usdpRate = {value: 1, timestamp: Date.now()}
    const { westRate, usdpRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const eastAmount = (westToUsdpAmount * westRate.value) / usdpPart
    const usdpAmount = westToUsdpAmount * westRate.value / usdpRate.value

    return {
      eastAmount: roundValue(eastAmount),
      usdpAmount: roundValue(usdpAmount),
      westRate,
      usdpRate
    }
  }

  async recalculateVault(oldVault: Vault): Promise<{
    eastAmount: number,
    usdpAmount: number,
    westAmount: number,
    westRate: Oracle,
    usdpRate: Oracle
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
    const eastAmount = roundValue(usdpAmount / usdpPart)
    const westAmount = (usdTotal - usdToUsdpAmount) / westRate.value

    if (eastAmount > oldEastAmount) {
      return {
        eastAmount,
        usdpAmount: roundValue(usdpAmount),
        westAmount: roundValue(westAmount),
        westRate,
        usdpRate
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
      asset_id: assetId,
      recipient
    } = await this.stateService.getTransactionInfoOrFail<TransferTx>(transferId);

    if (assetId) {
      throw new Error(`Expected transfer asset to be WEST, got: ${assetId}`);
    }

    if (transferAmount < MINIMUM_TRANSFER * Math.pow(10, WEST_DECIMALS)) {
      throw new Error(`Minimum transfer amount is: ${MINIMUM_TRANSFER * Math.pow(10, WEST_DECIMALS)}, got: ${transferAmount}`);
    }

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
    const vaultExists = await this.stateService.isVaultExists(tx.sender)
    if (vaultExists) {
      throw new Error(`Vault for user ${tx.sender} alreasy exist, use methods supply and reissue`);
    }

    const transferAmount = await this.checkTransfer(tx, transferId)
    const parsedTransferAmount = parseFloat(transferAmount + '') / Math.pow(10, WEST_DECIMALS)
    const vault = await this.calculateVault(parsedTransferAmount) as Vault
    vault.updatedAt = Date.now();

    let totalSupply = await this.stateService.getTotalSupply();
    let totalUsdap = await this.stateService.getTotalUsdap();
    let balance = await this.stateService.getBalance(tx.sender);
    balance += vault.eastAmount;
    totalSupply += vault.eastAmount;
    totalUsdap += vault.usdpAmount;
    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + totalSupply
      },
      {
        key: StateKeys.totalUsdap,
        string_value: '' + totalUsdap
      },
      {
        key: `${StateKeys.balance}_${tx.sender}`,
        string_value: '' + balance
      },
      {
        key: `${StateKeys.vault}_${tx.sender}`,
        string_value: JSON.stringify(vault)
      },
      {
        key: `${StateKeys.exchange}_${transferId}`,
        bool_value: true
      }
    ];
  }

  async reissue(tx: Transaction, { maxWestToExchange }: ReissueParam): Promise<DataEntryRequest[]> {
    const oldVault = await this.stateService.getVault(tx.sender);

    let newVault: Vault = await this.recalculateVault(oldVault) as Vault

    if (!newVault) {
      throw new Error(`Cannot increase east amount`);
    }

    const westAmountDelta = oldVault.westAmount - newVault.westAmount;

    if (maxWestToExchange && westAmountDelta > maxWestToExchange) {
      const exchange = await this.exchangeWest(maxWestToExchange);
      newVault = {
        ...oldVault,
        eastAmount: oldVault.eastAmount + exchange.eastAmount,
        westAmount: oldVault.westAmount - maxWestToExchange,
        usdpAmount: oldVault.usdpAmount + exchange.usdpAmount,
        westRate: exchange.westRate,
        usdpRate: exchange.usdpRate
      }
    }

    let totalSupply = await this.stateService.getTotalSupply();
    let totalUsdap = await this.stateService.getTotalUsdap();
    let balance = await this.stateService.getBalance(tx.sender);
    const diff = newVault.eastAmount - oldVault.eastAmount;
    newVault.updatedAt = Date.now();

    balance += diff;
    totalSupply += diff;
    totalUsdap +=  newVault.usdpAmount - oldVault.usdpAmount;

    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + totalSupply
      },
      {
        key: StateKeys.totalUsdap,
        string_value: '' + totalUsdap
      },
      {
        key: `${StateKeys.balance}_${tx.sender}`,
        string_value: '' + balance
      },
      {
        key: `${StateKeys.vault}_${tx.sender}`,
        string_value: JSON.stringify(newVault)
      }
    ];
  }

  async closeInit(tx: Transaction): Promise<DataEntryRequest[]> {
    const { updatedAt } = await this.stateService.getVault(tx.sender);
    const { minHoldTime } = await this.stateService.getConfig();

    const holdTime = Date.now() - updatedAt;
    if (holdTime < minHoldTime) {
      throw new Error(`minHoldTime more than holdTime: ${holdTime}`);
    }
    return []
  }

  async close(tx: Transaction, { address, usdpTransferId, westTransferId }: CloseParam): Promise<DataEntryRequest[]> {
    // only contract creator allowed
    await this.checkAdminPermissions(tx);
    const { USDapTokenId } = await this.stateService.getConfig();

    /**
     * check transfers
     */
    const { eastAmount, usdpAmount, westAmount } = await this.stateService.getVault(address);
    const {
      sender_public_key: westSenderPubKey,
      amount: westTransferAmount,
      recipient: westRecipient,
      asset_id: westAssetId,
    } = await this.stateService.getTransactionInfoOrFail<TransferTx>(westTransferId);

    const {
      sender_public_key: usdpSenderPubKey,
      amount: usdpTransferAmount,
      recipient: usdpRecipient,
      asset_id: usdpAssetId,
    } = await this.stateService.getTransactionInfoOrFail<TransferTx>(usdpTransferId);

    // check recipients
    if (address !== westRecipient) {
      throw new Error(`Expected westRecipient to be equal to ${address}, got: ${westRecipient}`);
    }
    if (address !== usdpRecipient) {
      throw new Error(`Expected usdpRecipient to be equal to ${address}, got: ${usdpRecipient}`);
    }

    // check sender_public_key
    if (tx.sender_public_key !== westSenderPubKey) {
      throw new Error(`Expected westSenderPubKey to be equal to ${tx.sender_public_key}, got: ${westSenderPubKey}`);
    }
    if (tx.sender_public_key !== usdpSenderPubKey) {
      throw new Error(`Expected usdpSenderPubKey to be equal to ${tx.sender_public_key}, got: ${usdpSenderPubKey}`);
    }

    // check assets id
    if (westAssetId) {
      throw new Error(`Expected transfer asset to be WEST, now: ${westAssetId}`);
    }
    if (usdpAssetId !== USDapTokenId) {
      throw new Error(`Expected transfer asset to be ${USDapTokenId}, got: ${usdpAssetId}`);
    }

    // check transfers amounts
    if (roundValue(parseValue(westTransferAmount)) !== roundValue(westAmount) - CLOSE_COMISSION) {
      throw new Error(`west transfer amount must be more or equal vault amount, 
        westAmount: ${westAmount}, westTransferAmount: ${westTransferAmount}`)
    }
    if (roundValue(parseValue(usdpTransferAmount)) !== roundValue(usdpAmount)) {
      throw new Error(`usdp transfer amount not equal to vault amount, 
        usdpAmount: ${usdpAmount}, usdpTransferAmount: ${usdpTransferAmount}`)
    }

    let totalSupply = await this.stateService.getTotalSupply();
    let totalUsdap = await this.stateService.getTotalUsdap();
    let balance = await this.stateService.getBalance(address);

    // check balance
    if (balance < eastAmount) {
      throw new Error(`Not enought EAST amount(${eastAmount}) on ${address} to burn vault: ${address}`);
    }

    balance -= eastAmount;
    totalSupply -= eastAmount;
    totalUsdap -= usdpAmount;
    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + Math.max(totalSupply, 0)
      }, 
      {
        key: StateKeys.totalUsdap,
        string_value: '' + totalUsdap
      }, 
      {
        key: `${StateKeys.balance}_${address}`,
        string_value: '' + Math.max(balance, 0)
      },
      {
        key: `${StateKeys.vault}_${address}`,
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

  async liquidate(tx: Transaction, { address }: LiquidateParam): Promise<DataEntryRequest[]> {
    // only contract creator allowed
    await this.checkAdminPermissions(tx);
    const { eastAmount, westAmount, usdpAmount } = await this.stateService.getVault(address);
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
      throw new Error(`Cannot liquidate vault ${address}, currentWestCollateral: ${currentWestCollateral}, liquidationCollateral: ${liquidationCollateral}`);
    }

    const liquidatedVault = {
      eastAmount,
      usdpAmount: eastAmount,
      address,
      liquidated: true,
      westRate
    }

    let totalUsdap = await this.stateService.getTotalUsdap();
    totalUsdap += liquidatedVault.usdpAmount - usdpAmount;

    return [
      {
        key: StateKeys.totalUsdap,
        string_value: '' + totalUsdap
      },
      {
        key: `${StateKeys.vault}_${address}`,
        string_value: ''
      },
      {
        key: `${StateKeys.liquidatedVault}_${address}_${Date.now()}`,
        string_value: JSON.stringify(liquidatedVault)
      }
    ];
  }

  async supply(tx: Transaction, { transferId }: SupplyParam): Promise<DataEntryRequest[]> {
    const vault = await this.stateService.getVault(tx.sender);
    const transferAmount = await this.checkTransfer(tx, transferId);
    vault.westAmount = vault.westAmount + (Number(transferAmount) / Math.pow(10, WEST_DECIMALS));

    return [
      {
        key: `${StateKeys.vault}_${tx.sender}`,
        string_value: JSON.stringify(vault)
      },
      {
        key: `${StateKeys.exchange}_${transferId}`,
        bool_value: true
      }
    ];
  }


  async claimOverpay(tx: Transaction, { address, transferId, requestId }: ClaimOverpayParam) {
    await this.checkAdminPermissions(tx);

    const vault = await this.stateService.getVault(address);
    const {
      sender_public_key: senderPubKey,
      asset_id: assetId,
      amount,
      recipient,
      attachment,
    } = await this.stateService.getTransactionInfoOrFail<TransferTx>(transferId);

    // checks
    if (address !== recipient) {
      throw new Error(`Expected recipient to be equal to ${address}, got: ${recipient}`);
    }
    if (tx.sender_public_key !== senderPubKey) {
      throw new Error(`Expected senderPubKey to be equal to ${tx.sender_public_key}, got: ${senderPubKey}`);
    }
    if (assetId) {
      throw new Error(`Expected transfer asset to be WEST, now: ${assetId}`);
    }
    if (requestId !== attachment) {
      throw new Error(`Expected transfer requestId: ${requestId} to be equal attachment: ${attachment}`);
    }

    const isTransferUsed = await this.stateService.isTransferUsed(transferId)
    if (isTransferUsed) {
      throw new Error(`Transfer ${transferId} is already used for accounting`);
    }

    const amountParsed = amount / Math.pow(10, WEST_DECIMALS);
    const newWestAmount = roundValue(vault.westAmount - amountParsed - CLAIN_OVERPAY_COMISSION);
    if (newWestAmount <= 0) {
      throw new Error(`newWestAmount less than 0, newWestAmount: ${newWestAmount}, amountParsed: ${amountParsed}`);
    }

    vault.westAmount = newWestAmount;

    return [
      {
        key: `${StateKeys.vault}_${address}`,
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

  async checkIssueEnabled(): Promise<void> {
    const { issueEnabled } = await this.stateService.getConfig();
    if (!issueEnabled) {
      throw new Error('EAST issue disabled, check config params');
    }
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
          await this.checkIssueEnabled();
          results = await this.mint(tx, value);
          break;
        case Operations.transfer:
          results = await this.transfer(tx, value);
          break;
        case Operations.reissue:
          await this.checkIssueEnabled();
          results = await this.reissue(tx, value);
          break;
        case Operations.close_init:
          results = await this.closeInit(tx);
          break;
        case Operations.close:
          results = await this.close(tx, value);
          break;
        case Operations.claim_overpay_init:
          results = [];
          break;
        case Operations.claim_overpay:
          results = await this.claimOverpay(tx, value);
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
