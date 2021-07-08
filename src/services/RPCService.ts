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
import { ConfigDto } from '../dto/config.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { MintDto } from '../dto/mint.dto';
import { TransferDto } from '../dto/transfer.dto';
import { CloseDto } from '../dto/close.dto';
import { ReissueDto } from '../dto/reissue.dto';
import { SupplyDto } from '../dto/supply.dto';
import { ClaimOverpayDto } from '../dto/claim-overpay.dto';
import { LiquidateDto } from '../dto/liquidate.dto';


const logger = createLogger('GRPC service');

const CONTRACT_PROTO = path.resolve(__dirname, '../protos', 'contract', 'contract_contract_service.proto');
const TRANSACTIONS_PROTO = path.resolve(__dirname, '../protos', 'contract', 'contract_transaction_service.proto');
const ADDRESS_PROTO = path.resolve(__dirname, '../protos', 'contract', 'contract_address_service.proto');
const PROTO_DIR = path.join(__dirname, '../protos')


const definitions = loadSync(
  [TRANSACTIONS_PROTO, CONTRACT_PROTO, ADDRESS_PROTO],
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
const AddressService = proto.AddressService as ServiceClientConstructor;



// CONSTS
const WEST_DECIMALS = 8
const WEST_ORACLE_STREAM = '000003_latest'
const RWA_ORACLE_STREAM = '000010_latest'
const MINIMUM_TRANSFER = 0.1
const CLAIN_OVERPAY_COMISSION = 0.2
const CLOSE_COMISSION = 0.3
const CLAIM_OVERPAY_INACCURACY = 1.05

function roundValue(num: number) {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  return +num.toFixed(WEST_DECIMALS);
}

function parseValue(num: number, decimalPlaces: number = WEST_DECIMALS) {
  return parseFloat(num + '') / Math.pow(10, decimalPlaces)
}

export class RPCService {
  // eslint-disable-next-line
  client: any;
  txClient: any;
  addressService: any;
  private stateService: StateService;
  private txTimestamp!: number;

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
    this.addressService = new AddressService(`${NODE}:${NODE_PORT}`, credentials.createInsecure());

    this.stateService = new StateService(this.client, this.txClient, this.addressService);
  }

  async checkAdminBalance(rwaAmount: number, totalRwa: number) {
    const { adminAddress, rwaTokenId } = await this.stateService.getConfig()
    const { amount, decimals } = await this.stateService.getAssetBalance(adminAddress, rwaTokenId)
    const parsedAmount = parseValue(amount, decimals)
    const diff = parsedAmount - rwaAmount + totalRwa
    if (diff < 0) {
      throw new Error('Insufficient RWA balance in protocol to mint new EAST. Please try again later or contact technical support.')
    }
  }

  async validate(dtoClass: any, obj: Record<string, any>) {
    const errors = await validate(plainToClass(dtoClass, obj))
    if (errors.length > 0) {
      throw new Error(`Validation error: ${errors.map(error => Object.values(error.constraints as Object)).join(', ')}`)
    }
  }

  validateConfig(config: ConfigDto) {
    return this.validate(ConfigDto, config)
  }

  async handleDockerCreate(tx: Transaction): Promise<void> {
    const defaultVals = {
      issueEnabled: true
    }
    const paramConfig = tx.params[0];
    const config = JSON.parse(paramConfig.string_value || '{}');
    await this.validateConfig(config)
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
        key: StateKeys.totalRwa,
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

  async getLastOracles(oracleTimestampMaxDiff: number, oracleContractId: string) : Promise<{ westRate: Oracle, rwaRate: Oracle }> {
    const westRate = JSON.parse(await this.stateService.getContractKeyValue(WEST_ORACLE_STREAM, oracleContractId))
    const rwaRate = JSON.parse(await this.stateService.getContractKeyValue(RWA_ORACLE_STREAM, oracleContractId))

    const westTimeDiff = this.txTimestamp - westRate.timestamp;
    const rwaTimeDiff = this.txTimestamp - rwaRate.timestamp;

    if (westTimeDiff > oracleTimestampMaxDiff || rwaTimeDiff > oracleTimestampMaxDiff) {
      throw new Error(`Too big difference in milliseconds between oracle_data.timestamp and current timestamp: 
        westRate: ${JSON.stringify(westRate)}, rwaRate: ${JSON.stringify(rwaRate)}, ${westTimeDiff}, ${rwaTimeDiff}, ${oracleTimestampMaxDiff}`)
    }
    return { westRate, rwaRate }
  }

  async calculateVault(transferAmount: number): Promise<{
    eastAmount: number,
    rwaAmount: number,
    westAmount: number,
    westRate: Oracle,
    rwaRate: Oracle,
    liquidationCollateral: number
  }> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      rwaPart,
      westCollateral,
      liquidationCollateral
    } = await this.stateService.getConfig()
    
    // mock
    // const westRate = {value: 0.34, timestamp: Date.now()}, rwaRate = {value: 1, timestamp: Date.now()}
    const { westRate, rwaRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const rwaPartInPosition = rwaPart / ((1 - rwaPart) * westCollateral + rwaPart)
    const westToRwaAmount = rwaPartInPosition * transferAmount
    const eastAmount = (westToRwaAmount * westRate.value) / rwaPart
    const rwaAmount = westToRwaAmount * westRate.value / rwaRate.value

    return {
      eastAmount: roundValue(eastAmount),
      rwaAmount: roundValue(rwaAmount),
      westAmount: roundValue(transferAmount - westToRwaAmount),
      westRate,
      rwaRate,
      liquidationCollateral
    }
  }

  async exchangeWest(westToRwaAmount: number): Promise<{
    eastAmount: number,
    rwaAmount: number,
    westRate: Oracle,
    rwaRate: Oracle
  }> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      rwaPart
    } = await this.stateService.getConfig()
    
    // mock
    // const westRate = {value: 0.34, timestamp: Date.now()}, rwaRate = {value: 1, timestamp: Date.now()}
    const { westRate, rwaRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const eastAmount = (westToRwaAmount * westRate.value) / rwaPart
    const rwaAmount = westToRwaAmount * westRate.value / rwaRate.value

    return {
      eastAmount: roundValue(eastAmount),
      rwaAmount: roundValue(rwaAmount),
      westRate,
      rwaRate
    }
  }

  async recalculateVault(oldVault: Vault): Promise<{
    eastAmount: number,
    rwaAmount: number,
    westAmount: number,
    westRate: Oracle,
    rwaRate: Oracle
  } | false> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      rwaPart,
      westCollateral
    } = await this.stateService.getConfig();
    
    // mock
    // const westRate = {value: 0.68, timestamp: Date.now()}, usdpRate = {value: 1, timestamp: Date.now()}
    const { westRate, rwaRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const {
      eastAmount: oldEastAmount,
      rwaAmount: oldRwaAmount,
      westAmount: oldWestAmount
    } = oldVault;

    const usdTotal = oldRwaAmount * rwaRate.value + oldWestAmount * westRate.value
    const rwaPartInPosition = rwaPart / ((1 - rwaPart) * westCollateral + rwaPart)
    const usdToRwaAmount = rwaPartInPosition * usdTotal
    const rwaAmount = usdToRwaAmount / rwaRate.value
    const eastAmount = roundValue(rwaAmount / rwaPart)
    const westAmount = (usdTotal - usdToRwaAmount) / westRate.value

    if (eastAmount > oldEastAmount) {
      return {
        eastAmount,
        rwaAmount: roundValue(rwaAmount),
        westAmount: roundValue(westAmount),
        westRate,
        rwaRate
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

  async mint(tx: Transaction, param: MintParam): Promise<DataEntryRequest[]> {
    await this.validate(MintDto, param)
    const { transferId } = param
    const vaultExists = await this.stateService.isVaultExists(tx.sender)
    if (vaultExists) {
      throw new Error(`Vault for user ${tx.sender} alreasy exist, use methods supply and reissue`);
    }

    const transferAmount = await this.checkTransfer(tx, transferId)
    const parsedTransferAmount = parseFloat(transferAmount + '') / Math.pow(10, WEST_DECIMALS)
    const vault = await this.calculateVault(parsedTransferAmount) as Vault

    vault.updatedAt = this.txTimestamp;
    let totalSupply = await this.stateService.getTotalSupply();
    let totalRwa = await this.stateService.getTotalRwa();
    await this.checkAdminBalance(vault.rwaAmount, totalRwa);
    let balance = await this.stateService.getBalance(tx.sender);
    balance += vault.eastAmount;
    totalSupply += vault.eastAmount;
    totalRwa += vault.rwaAmount;
    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + totalSupply
      },
      {
        key: StateKeys.totalRwa,
        string_value: '' + totalRwa
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

  async reissue(tx: Transaction, param: ReissueParam): Promise<DataEntryRequest[]> {
    await this.validate(ReissueDto, param)
    const { maxWestToExchange } = param
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
        rwaAmount: oldVault.rwaAmount + exchange.rwaAmount,
        westRate: exchange.westRate,
        rwaRate: exchange.rwaRate
      }
    }

    let totalSupply = await this.stateService.getTotalSupply();
    let totalRwa = await this.stateService.getTotalRwa();
    await this.checkAdminBalance(newVault.rwaAmount - oldVault.rwaAmount, totalRwa);
    let balance = await this.stateService.getBalance(tx.sender);
    const diff = newVault.eastAmount - oldVault.eastAmount;
    newVault.updatedAt = this.txTimestamp;

    balance += diff;
    totalSupply += diff;
    totalRwa +=  newVault.rwaAmount - oldVault.rwaAmount;

    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + totalSupply
      },
      {
        key: StateKeys.totalRwa,
        string_value: '' + totalRwa
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

    const holdTime = this.txTimestamp - updatedAt;
    if (holdTime < minHoldTime) {
      throw new Error(`minHoldTime more than holdTime: ${holdTime}`);
    }
    return []
  }

  async close(tx: Transaction, param: CloseParam): Promise<DataEntryRequest[]> {
    await this.validate(CloseDto, param)
    // only contract creator allowed
    const { address, rwaTransferId, westTransferId } = param
    await this.checkAdminPermissions(tx);
    const { rwaTokenId } = await this.stateService.getConfig();

    /**
     * check transfers
     */
    const { eastAmount, rwaAmount, westAmount } = await this.stateService.getVault(address);
    const {
      sender_public_key: westSenderPubKey,
      amount: westTransferAmount,
      recipient: westRecipient,
      asset_id: westAssetId,
    } = await this.stateService.getTransactionInfoOrFail<TransferTx>(westTransferId);

    const {
      sender_public_key: rwaSenderPubKey,
      amount: rwaTransferAmount,
      recipient: rwaRecipient,
      asset_id: rwaAssetId,
    } = await this.stateService.getTransactionInfoOrFail<TransferTx>(rwaTransferId);

    // check recipients
    if (address !== westRecipient) {
      throw new Error(`Expected westRecipient to be equal to ${address}, got: ${westRecipient}`);
    }
    if (address !== rwaRecipient) {
      throw new Error(`Expected rwaRecipient to be equal to ${address}, got: ${rwaRecipient}`);
    }

    // check sender_public_key
    if (tx.sender_public_key !== westSenderPubKey) {
      throw new Error(`Expected westSenderPubKey to be equal to ${tx.sender_public_key}, got: ${westSenderPubKey}`);
    }
    if (tx.sender_public_key !== rwaSenderPubKey) {
      throw new Error(`Expected rwaSenderPubKey to be equal to ${tx.sender_public_key}, got: ${rwaSenderPubKey}`);
    }

    // check assets id
    if (westAssetId) {
      throw new Error(`Expected transfer asset to be WEST, now: ${westAssetId}`);
    }
    if (rwaAssetId !== rwaTokenId) {
      throw new Error(`Expected transfer asset to be ${rwaTokenId}, got: ${rwaAssetId}`);
    }

    // check transfers amounts
    if (roundValue(parseValue(westTransferAmount)) !== roundValue(westAmount - CLOSE_COMISSION)) {
      throw new Error(`west transfer amount must be more or equal vault amount, 
        westAmount: ${westAmount}, westTransferAmount: ${westTransferAmount}`)
    }
    if (roundValue(parseValue(rwaTransferAmount)) !== roundValue(rwaAmount)) {
      throw new Error(`rwa transfer amount not equal to vault amount, 
        rwaAmount: ${rwaAmount}, rwaTransferAmount: ${rwaTransferAmount}`)
    }

    let totalSupply = await this.stateService.getTotalSupply();
    let totalRwa = await this.stateService.getTotalRwa();
    let balance = await this.stateService.getBalance(address);

    // check balance
    if (balance < eastAmount) {
      throw new Error(`Not enought EAST amount(${eastAmount}) on ${address} to burn vault: ${address}`);
    }

    balance -= eastAmount;
    totalSupply -= eastAmount;
    totalRwa -= rwaAmount;
    return [
      {
        key: StateKeys.totalSupply,
        string_value: '' + Math.max(totalSupply, 0)
      }, 
      {
        key: StateKeys.totalRwa,
        string_value: '' + totalRwa
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
    await this.validate(TransferDto, value)
    const { to, amount } = value
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

  async liquidate(tx: Transaction, param: LiquidateParam): Promise<DataEntryRequest[]> {
    await this.validate(LiquidateDto, param)
    const { address } = param
    // only contract creator allowed
    await this.checkAdminPermissions(tx);
    const { eastAmount, westAmount, rwaAmount, liquidationCollateral } = await this.stateService.getVault(address);
    const { 
      oracleContractId,
      rwaPart
    } = await this.stateService.getConfig();
    
    const westRate = JSON.parse(await this.stateService.getContractKeyValue(WEST_ORACLE_STREAM, oracleContractId));
    // mock
    // const westRate = { value: 0.1, timestamp: Date.now() }

    const westPart = 1 - rwaPart;
    const currentWestCollateral = (westAmount * westRate.value) / (westPart * eastAmount);

    if (currentWestCollateral > liquidationCollateral) {
      throw new Error(`Cannot liquidate vault ${address}, currentWestCollateral: ${currentWestCollateral}, liquidationCollateral: ${liquidationCollateral}`);
    }

    const liquidatedVault = {
      eastAmount,
      rwaAmount: eastAmount,
      address,
      liquidated: true,
      westRate,
      liquidationCollateral
    }

    let totalRwa = await this.stateService.getTotalRwa();
    totalRwa += liquidatedVault.rwaAmount - rwaAmount;

    return [
      {
        key: StateKeys.totalRwa,
        string_value: '' + totalRwa
      },
      {
        key: `${StateKeys.vault}_${address}`,
        string_value: ''
      },
      {
        key: `${StateKeys.liquidatedVault}_${address}_${this.txTimestamp}`,
        string_value: JSON.stringify(liquidatedVault)
      }
    ];
  }

  async supply(tx: Transaction, param: SupplyParam): Promise<DataEntryRequest[]> {
    await this.validate(SupplyDto, param)
    const { transferId } = param
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


  async claimOverpay(tx: Transaction, param: ClaimOverpayParam) {
    await this.validate(ClaimOverpayDto, param)
    await this.checkAdminPermissions(tx);

    const { address, transferId, requestId } = param
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
    // check claim overpay limits
    const { oracleContractId, rwaPart, westCollateral } = await this.stateService.getConfig();
    const westRate = JSON.parse(await this.stateService.getContractKeyValue(WEST_ORACLE_STREAM, oracleContractId))
    const rwaRate = JSON.parse(await this.stateService.getContractKeyValue(RWA_ORACLE_STREAM, oracleContractId))
    const westPart = 1 - rwaPart;
    const westExpectedValue = vault.eastAmount * westPart * rwaRate.value * westCollateral
    const expectedWestAmount = westExpectedValue / westRate.value
    const expectedTransferAmount = vault.westAmount - expectedWestAmount

    if (amountParsed > expectedTransferAmount * CLAIM_OVERPAY_INACCURACY) {
      throw new Error(`Maximum allowable withdrawal: ${expectedTransferAmount * CLAIM_OVERPAY_INACCURACY}, received: ${amountParsed}`);
    }

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
    await this.validateConfig(config);

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
    this.txTimestamp = tx.timestamp;
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
