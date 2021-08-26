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
  ReissueParam,
  WriteLiquidationWestTransferParam
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
import { BigNumber } from 'bignumber.js';
import { add, divide, multiply, subtract } from './math';


const logger = createLogger('GRPC service');

const CONTRACT_PROTO = path.resolve(__dirname, '../protos', 'contract', 'contract_contract_service.proto');
const TRANSACTIONS_PROTO = path.resolve(__dirname, '../protos', 'contract', 'contract_transaction_service.proto');
const ADDRESS_PROTO = path.resolve(__dirname, '../protos', 'contract', 'contract_address_service.proto');
const CONTRACT_UTIL_PROTO = path.resolve(__dirname, '../protos', 'contract', 'contract_util_service.proto');
const PROTO_DIR = path.join(__dirname, '../protos')


const definitions = loadSync(
  [TRANSACTIONS_PROTO, CONTRACT_PROTO, ADDRESS_PROTO, CONTRACT_UTIL_PROTO],
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
const ContractUtilService = proto.UtilService as ServiceClientConstructor;



// CONSTS
const WEST_DECIMALS = 8
const EAST_DECIMALS = 8
const WEST_ORACLE_STREAM = '000003_latest'
const RWA_ORACLE_STREAM = '000010_latest'
const MINIMUM_EAST_AMOUNT_TO_BUY = 1
const CLAIM_OVERPAY_COMISSION = 0.2
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
  private readonly contractUtilService: any;
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
    this.contractUtilService = new ContractUtilService(`${NODE}:${NODE_PORT}`, credentials.createInsecure());

    this.stateService = new StateService(this.client, this.txClient, this.addressService, this.contractUtilService);
  }

  async checkAdminBalance(rwaAmount: BigNumber, totalRwa: BigNumber) {
    const { adminAddress, rwaTokenId } = await this.stateService.getConfig()
    const amount = await this.stateService.getAssetBalance(adminAddress, rwaTokenId)
    const diff = add(subtract(amount, rwaAmount), totalRwa)
    if (diff.isLessThan(0)) {
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
      isContractEnabled: true,
      txTimestampMaxDiff: 1000 * 60 * 5
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

  async getLastOracles(oracleTimestampMaxDiff: number, oracleContractId: string): Promise<{ westRate: Oracle, rwaRate: Oracle }> {
    const westRate = JSON.parse(await this.stateService.getContractKeyValue(WEST_ORACLE_STREAM, oracleContractId))
    const rwaRate = JSON.parse(await this.stateService.getContractKeyValue(RWA_ORACLE_STREAM, oracleContractId))

    const westTimeDiff = this.txTimestamp - westRate.timestamp;
    const rwaTimeDiff = this.txTimestamp - rwaRate.timestamp;

    if (westTimeDiff > oracleTimestampMaxDiff || rwaTimeDiff > oracleTimestampMaxDiff) {
      throw new Error(`Too big difference in milliseconds between oracle_data.timestamp and current timestamp: 
        westRate: ${JSON.stringify(westRate)}, rwaRate: ${JSON.stringify(rwaRate)}, ${westTimeDiff}, ${rwaTimeDiff}, ${oracleTimestampMaxDiff}`)
    }
    westRate.value = new BigNumber(westRate.value.toString())
    rwaRate.value = new BigNumber(westRate.value.toString())
    return { westRate, rwaRate }
  }

  async calculateEastAmount(namedArgs: { transferAmount: BigNumber, rwaPart: BigNumber, westCollateral: BigNumber, westRate: Oracle }) {
    const { rwaPart, westCollateral, westRate, transferAmount } = namedArgs
    const eastPriceInWest = add(
      divide(rwaPart, westRate.value),
      multiply(
        divide(
          subtract(new BigNumber(1), rwaPart),
          westRate.value
        ),
        westCollateral
      )
    );
    const eastAmount = divide(transferAmount, eastPriceInWest);
    return eastAmount.decimalPlaces(EAST_DECIMALS)
  }

  async calculateVault(transferAmount: BigNumber): Promise<{
    eastAmount: BigNumber,
    rwaAmount: BigNumber,
    westAmount: BigNumber,
    westRate: Oracle,
    rwaRate: Oracle,
    liquidationCollateral: BigNumber
  }> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      rwaPart,
      westCollateral,
      liquidationCollateral
    } = await this.stateService.getConfig()

    const { westRate, rwaRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const rwaPartInPosition = divide(
      rwaPart,
      add(
        multiply(
          subtract(new BigNumber(1), rwaPart), 
          westCollateral
        ),
        rwaPart
      )
    );
    const westToRwaAmount = multiply(rwaPartInPosition, transferAmount);
    const rwaAmount = divide(multiply(westToRwaAmount, westRate.value), rwaRate.value);
    return {
      eastAmount: await this.calculateEastAmount({
        transferAmount,
        rwaPart,
        westCollateral,
        westRate,
      }),
      rwaAmount: rwaAmount.decimalPlaces(EAST_DECIMALS),
      westAmount: subtract(transferAmount, westToRwaAmount).decimalPlaces(EAST_DECIMALS),
      westRate,
      rwaRate,
      liquidationCollateral
    }
  }

  async exchangeWest(westToRwaAmount: BigNumber): Promise<{
    eastAmount: BigNumber,
    rwaAmount: BigNumber,
    westRate: Oracle,
    rwaRate: Oracle,
  }> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      rwaPart,
      westCollateral,
    } = await this.stateService.getConfig()
    const { westRate, rwaRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const eastPriceInWest = add(
      divide(rwaPart, westRate.value),
      multiply(
        divide(
          subtract(new BigNumber(1), rwaPart),
          westRate.value
        ),
        westCollateral
      )
    );
    const eastAmount = divide(westToRwaAmount, eastPriceInWest);
    const rwaAmount = divide(multiply(westToRwaAmount, westRate.value), rwaRate.value);
    return {
      eastAmount: eastAmount.decimalPlaces(EAST_DECIMALS),
      rwaAmount: rwaAmount.decimalPlaces(EAST_DECIMALS),
      westRate,
      rwaRate
    }
  }

  async recalculateVault(oldVault: Vault): Promise<{
    eastAmount: BigNumber,
    rwaAmount: BigNumber,
    westAmount: BigNumber,
    westRate: Oracle,
    rwaRate: Oracle
  } | false> {
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      rwaPart,
      westCollateral
    } = await this.stateService.getConfig();

    const { westRate, rwaRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const {
      eastAmount: oldEastAmount,
      rwaAmount: oldRwaAmount,
      westAmount: oldWestAmount
    } = oldVault;

    const usdTotal = add(
      multiply(oldRwaAmount, rwaRate.value),
      multiply(oldWestAmount, westRate.value)
    );
    const rwaPartInPosition = divide(
      rwaPart,
      add(
        multiply(
          subtract(new BigNumber(1), rwaPart), 
          westCollateral
        ),
        rwaPart
      )
    );
    const usdToRwaAmount = multiply(rwaPartInPosition, usdTotal)
    const rwaAmount = divide(usdToRwaAmount, rwaRate.value)
    const eastPriceInWest = add(
      divide(rwaPart, westRate.value),
      multiply(
        divide(
          subtract(new BigNumber(1), rwaPart),
          westRate.value
        ),
        westCollateral
      )
    );
    const westAmount = divide(subtract(usdTotal, usdToRwaAmount), westRate.value)
    const eastAmount = divide(westAmount, eastPriceInWest)

    if (eastAmount.isGreaterThan(oldEastAmount)) {
      return {
        eastAmount: eastAmount.decimalPlaces(EAST_DECIMALS),
        rwaAmount: rwaAmount.decimalPlaces(EAST_DECIMALS),
        westAmount: westAmount.decimalPlaces(WEST_DECIMALS),
        westRate,
        rwaRate
      }
    } else {
      return false;
    }
  }

  async checkTransferAmount(transferAmount: BigNumber) {
    const { oracleContractId, oracleTimestampMaxDiff, rwaPart, westCollateral } = await this.stateService.getConfig();
    const { westRate } = await this.getLastOracles(oracleTimestampMaxDiff, oracleContractId);
    const eastAmount = await this.calculateEastAmount({
      transferAmount,
      rwaPart,
      westCollateral,
      westRate,
    })
    if (eastAmount.isLessThan(MINIMUM_EAST_AMOUNT_TO_BUY)) {
      throw new Error(`Minimum EAST amount to buy is: ${MINIMUM_EAST_AMOUNT_TO_BUY}, got: ${eastAmount}`);
    }
  }

  // returns amount
  async checkTransfer(tx: Transaction, transferId: string, transferAssetId?: string): Promise<BigNumber> {
    const {
      sender_public_key: senderPubKey,
      amount: transferAmount,
      asset_id: assetId,
      recipient
    } = await this.stateService.getTransactionInfoOrFail<TransferTx>(transferId);

    if (transferAssetId) {
      if (assetId !== transferAssetId) {
        throw new Error(`Expected transfer asset to be ${transferAssetId}, got: ${assetId}`);
      }
    } else {
      if (assetId) {
        throw new Error(`Expected transfer asset to be WEST, got: ${assetId}`);
      }
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

    return new BigNumber((transferAmount / Math.pow(10, WEST_DECIMALS)).toString());
  }

  async mint(tx: Transaction, param: MintParam): Promise<DataEntryRequest[]> {
    await this.validate(MintDto, param)
    const { transferId } = param
    const vaultExists = await this.stateService.isVaultExists(tx.sender)
    if (vaultExists) {
      throw new Error(`Vault for user ${tx.sender} alreasy exist, use methods supply and reissue`);
    }

    const transferAmount = await this.checkTransfer(tx, transferId)
    await this.checkTransferAmount(transferAmount)
    const vault = await this.calculateVault(transferAmount) as Vault;

    vault.updatedAt = this.txTimestamp;
    let totalSupply = await this.stateService.getTotalSupply();
    let totalRwa = await this.stateService.getTotalRwa();
    await this.checkAdminBalance(vault.rwaAmount, totalRwa);
    let balance = await this.stateService.getBalance(tx.sender);
    balance = add(balance, vault.eastAmount)
    totalSupply = add(totalSupply, vault.eastAmount);
    totalRwa = add(totalRwa, vault.rwaAmount);
    return [
      {
        key: StateKeys.totalSupply,
        string_value: totalSupply.decimalPlaces(EAST_DECIMALS).toString()
      },
      {
        key: StateKeys.totalRwa,
        string_value: totalRwa.decimalPlaces(EAST_DECIMALS).toString()
      },
      {
        key: `${StateKeys.balance}_${tx.sender}`,
        string_value: balance.decimalPlaces(EAST_DECIMALS).toString()
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
    let maxWestToExchange;
    if (param.maxWestToExchange !== undefined) {
      maxWestToExchange = new BigNumber(param.maxWestToExchange.toString());
    }
    const oldVault = await this.stateService.getVault(tx.sender);

    let newVault: Vault = await this.recalculateVault(oldVault) as Vault

    if (!newVault) {
      throw new Error(`Cannot increase east amount`);
    }

    const westAmountDelta = subtract(oldVault.westAmount, newVault.westAmount);

    if (maxWestToExchange !== undefined && westAmountDelta.isGreaterThan(maxWestToExchange)) {
      const exchange = await this.exchangeWest(maxWestToExchange);
      newVault = {
        ...oldVault,
        eastAmount: add(oldVault.eastAmount, exchange.eastAmount),
        westAmount: subtract(oldVault.westAmount, maxWestToExchange),
        rwaAmount: add(oldVault.rwaAmount, exchange.rwaAmount),
        westRate: exchange.westRate,
        rwaRate: exchange.rwaRate
      }
    }

    let totalSupply = await this.stateService.getTotalSupply();
    let totalRwa = await this.stateService.getTotalRwa();
    await this.checkAdminBalance(subtract(newVault.rwaAmount, oldVault.rwaAmount), totalRwa);
    let balance = await this.stateService.getBalance(tx.sender);
    const diff = subtract(newVault.eastAmount, oldVault.eastAmount);
    newVault.updatedAt = this.txTimestamp;

    balance = add(balance, diff);
    totalSupply = add(totalSupply, diff);
    totalRwa = add(totalRwa, subtract(newVault.rwaAmount, oldVault.rwaAmount));

    return [
      {
        key: StateKeys.totalSupply,
        string_value: totalSupply.decimalPlaces(EAST_DECIMALS).toString()
      },
      {
        key: StateKeys.totalRwa,
        string_value: totalRwa.decimalPlaces(EAST_DECIMALS).toString()
      },
      {
        key: `${StateKeys.balance}_${tx.sender}`,
        string_value: balance.decimalPlaces(EAST_DECIMALS).toString()
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

    if (westTransferId !== undefined) {
      const {
        sender_public_key: westSenderPubKey,
        amount: _westTransferAmount,
        recipient: westRecipient,
        asset_id: westAssetId,
      } = await this.stateService.getTransactionInfoOrFail<TransferTx>(westTransferId);

      if (address !== westRecipient) {
        throw new Error(`Expected westRecipient to be equal to ${address}, got: ${westRecipient}`);
      }

      if (tx.sender_public_key !== westSenderPubKey) {
        throw new Error(`Expected westSenderPubKey to be equal to ${tx.sender_public_key}, got: ${westSenderPubKey}`);
      }

      if (westAssetId) {
        throw new Error(`Expected transfer asset to be WEST, now: ${westAssetId}`);
      }

      const westTransferAmount = new BigNumber((_westTransferAmount / Math.pow(10, WEST_DECIMALS)).toString())
      
      if (!westTransferAmount.isEqualTo(subtract(westAmount, new BigNumber(CLOSE_COMISSION.toString())))) {
        throw new Error(`west transfer amount must be more or equal vault amount, 
          westAmount: ${westAmount.toString()}, westTransferAmount: ${westTransferAmount.toString()}`)
      }
    }

    if (rwaTransferId !== undefined) {
      const {
        sender_public_key: rwaSenderPubKey,
        amount: _rwaTransferAmount,
        recipient: rwaRecipient,
        asset_id: rwaAssetId,
      } = await this.stateService.getTransactionInfoOrFail<TransferTx>(rwaTransferId);

      if (address !== rwaRecipient) {
        throw new Error(`Expected rwaRecipient to be equal to ${address}, got: ${rwaRecipient}`);
      }

      if (tx.sender_public_key !== rwaSenderPubKey) {
        throw new Error(`Expected rwaSenderPubKey to be equal to ${tx.sender_public_key}, got: ${rwaSenderPubKey}`);
      }

      if (rwaAssetId !== rwaTokenId) {
        throw new Error(`Expected transfer asset to be ${rwaTokenId}, got: ${rwaAssetId}`);
      }

      const rwaTransferAmount = new BigNumber((_rwaTransferAmount / Math.pow(10, EAST_DECIMALS)).toString());
      
      if (!rwaTransferAmount.isEqualTo(rwaAmount)) {
        throw new Error(`rwa transfer amount not equal to vault amount, 
          rwaAmount: ${rwaAmount}, rwaTransferAmount: ${rwaTransferAmount}`)
      }
    }

    let totalSupply = await this.stateService.getTotalSupply();
    let totalRwa = await this.stateService.getTotalRwa();
    let balance = await this.stateService.getBalance(address);

    // check balance
    if (balance.isLessThan(eastAmount)) {
      throw new Error(`Not enought EAST amount(${eastAmount.toString()}) on ${address} to burn vault: ${address}`);
    }

    balance = subtract(balance, eastAmount);
    totalSupply = subtract(totalSupply, eastAmount);
    totalRwa = subtract(totalRwa, rwaAmount);
    return [
      {
        key: StateKeys.totalSupply,
        string_value: BigNumber.maximum(totalSupply, '0').decimalPlaces(EAST_DECIMALS).toString()
      },
      {
        key: StateKeys.totalRwa,
        string_value: totalRwa.decimalPlaces(EAST_DECIMALS).toString()
      },
      {
        key: `${StateKeys.balance}_${address}`,
        string_value: BigNumber.maximum(balance, 0).decimalPlaces(EAST_DECIMALS).toString()
      },
      {
        key: `${StateKeys.vault}_${address}`,
        string_value: ''
      }
    ];
  }

  async transfer(tx: Transaction, value: TransferParam): Promise<DataEntryRequest[]> {
    await this.validate(TransferDto, value)
    const { to, amount: _amount } = value
    const from = tx.sender
    const amount = new BigNumber(_amount.toString())

    let fromBalance = await this.stateService.getBalance(from);
    if (fromBalance.isLessThan(amount)) {
      throw new Error(`Insufficient funds to transfer from "${from}": balance "${fromBalance.toString()}", amount "${amount}"`);
    }
    let toBalance = await this.stateService.getBalance(to);

    fromBalance = subtract(fromBalance, amount);
    toBalance = add(toBalance, amount);
    return [{
      key: `${StateKeys.balance}_${from}`,
      string_value: fromBalance.decimalPlaces(EAST_DECIMALS).toString()
    }, {
      key: `${StateKeys.balance}_${to}`,
      string_value: toBalance.decimalPlaces(EAST_DECIMALS).toString()
    }];
  }

  async liquidate(tx: Transaction, param: LiquidateParam): Promise<DataEntryRequest[]> {
    await this.validate(LiquidateDto, param);
    const { address, transferId } = param;

    const vaultExists = await this.stateService.isVaultExists(address);
    if (!vaultExists) {
      throw new Error(`Vault for user ${address} doesn't exist`);
    }

    const { eastAmount, westAmount, rwaAmount } = await this.stateService.getVault(address);
    const { rwaTokenId, oracleContractId, rwaPart, liquidationCollateral } = await this.stateService.getConfig();
    const transferAmount = await this.checkTransfer(tx, transferId, rwaTokenId);

    if (!transferAmount.isEqualTo(eastAmount)) {
      throw new Error(`Cannot liquidate vault ${address}: expected transfer amount: ${eastAmount.toString()}, received: ${transferAmount.toString()}`)
    }

    const westRate = JSON.parse(await this.stateService.getContractKeyValue(WEST_ORACLE_STREAM, oracleContractId));
    const westPart = 1 - rwaPart;
    const currentWestCollateral = (westAmount * westRate.value) / (westPart * eastAmount);

    if (currentWestCollateral > liquidationCollateral) {
      throw new Error(`Cannot liquidate vault ${address}, currentWestCollateral: ${currentWestCollateral}, liquidationCollateral: ${liquidationCollateral}`);
    }

    const liquidatedVault = {
      eastAmount: roundValue(eastAmount),
      rwaAmount: roundValue(eastAmount),
      address,
      liquidated: true,
      westRate,
      liquidationCollateral,
      liquidatedWestAmount: westAmount
    }

    let totalRwa = await this.stateService.getTotalRwa();
    totalRwa += liquidatedVault.rwaAmount - rwaAmount;

    return [
      {
        key: StateKeys.totalRwa,
        string_value: '' + roundValue(totalRwa)
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
    vault.westAmount = add(vault.westAmount, transferAmount).decimalPlaces(WEST_DECIMALS);

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
    let westExpectedValue = vault.eastAmount * westPart * rwaRate.value * westCollateral
    if (rwaPart === 0) {
      westExpectedValue = vault.eastAmount * westPart * westCollateral
    }
    const expectedWestAmount = westExpectedValue / westRate.value
    const expectedTransferAmount = vault.westAmount - expectedWestAmount

    if (amountParsed > expectedTransferAmount * CLAIM_OVERPAY_INACCURACY) {
      throw new Error(`Maximum allowable withdrawal: ${expectedTransferAmount * CLAIM_OVERPAY_INACCURACY}, received: ${amountParsed}`);
    }

    const newWestAmount = roundValue(vault.westAmount - amountParsed - CLAIM_OVERPAY_COMISSION);
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

  async writeLiquidationWestTransfer(tx: Transaction, param: WriteLiquidationWestTransferParam) {
    await this.checkAdminPermissions(tx);
    const { address, timestamp } = param;
    return [
      {
        key: `${StateKeys.liquidationExchange}_${address}_${timestamp}`,
        bool_value: true
      }
    ]
  }

  async checkIsContractEnabled(): Promise<void> {
    const { isContractEnabled } = await this.stateService.getConfig();
    if (!isContractEnabled) {
      throw new Error('EAST contract disabled.');
    }
  }

  async handleDockerCall(tx: Transaction): Promise<void> {
    const { params } = tx;
    let results: DataEntryRequest[] = [];

    // TODO: iterate params
    const param = params[0] || {};
    if (param) {
      if (Object.keys(Operations).filter(operationName => operationName !== Operations.update_config).includes(param.key)) {
        await this.checkIsContractEnabled();
      }
      const value = JSON.parse(param.string_value || '{}');
      switch (param.key) {
        case Operations.update_config:
          results = await this.updateConfig(tx, value);
          break;
        case Operations.mint:
          results = await this.mint(tx, value);
          break;
        case Operations.transfer:
          results = await this.transfer(tx, value);
          break;
        case Operations.reissue:
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
        case Operations.write_liquidation_west_transfer:
          results = await this.writeLiquidationWestTransfer(tx, value);
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
      switch (tx.type) {
        case TxType.DockerCreate:
          await this.handleDockerCreate(tx);
          break;
        case TxType.DockerCall:
          await this.setTxTimestamp(tx.timestamp);
          await this.handleDockerCall(tx);
          break;
      }
      logger.info(`Tx "${tx.id}" (type ${tx.type}) successfully mined, elapsed time: ${Date.now() - start}ms`);
    } catch (e) {
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

  private async validateTxTimestamp(timestamp: number): Promise<number> {
    const { txTimestampMaxDiff } = await this.stateService.getConfig();
    const { ntp } = await this.stateService.getNodeTime();
    const validationCaseMin = ntp - txTimestampMaxDiff;
    const validationCaseMax = ntp + txTimestampMaxDiff;
    if (!(timestamp >= validationCaseMin && timestamp <= validationCaseMax)) {
      throw new Error('Transaction timestamp is invalid.');
    }
    return timestamp
  }

  private async setTxTimestamp(value: number): Promise<void> {
    const validatedTimestamp = await this.validateTxTimestamp(value);
    this.txTimestamp = validatedTimestamp;
  }
}
