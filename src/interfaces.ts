import BigNumber from "bignumber.js"

declare module 'node-fetch';

type ValueOf<Obj> = Obj[keyof Obj]
type OneOnly<Obj, Key extends keyof Obj> = { [key in Exclude<keyof Obj, Key>]+?: never } & Pick<Obj, Key>
type OneOfByKey<Obj> = { [key in keyof Obj]: OneOnly<Obj, key> }
export type OneOfType<Obj> = ValueOf<OneOfByKey<Obj>>

export type DataEntryValueKeysRequest = OneOfType<{
  int_value: number,
  bool_value: boolean,
  binary_value: Buffer,
  string_value: string,
}>

export type DataEntryRequest = {
  key: string,
} & DataEntryValueKeysRequest

export type DataEntryValueKeysResponse = OneOfType<{
  int_value: string,
  bool_value: boolean,
  binary_value: Buffer,
  string_value: string,
}>

export type DataEntryResponse = {
  key: string,
  value: 'int_value' | 'bool_value' | 'binary_value' | 'string_value',
} & DataEntryValueKeysResponse;

export type Transaction = {
  id: string,
  type: number,
  sender: string,
  sender_public_key: string,
  contract_id: string,
  fee: number,
  version: number,
  proofs: Buffer,
  timestamp: number,
  fee_asset_id: {
    value: string,
  },
  params: DataEntryResponse[],
}
export type ContractTransactionResponse = {
  transaction: Transaction,
  auth_token: string,
}

export interface OracleJson {
  value: string,
  timestamp: number
}

export interface Oracle {
  value: BigNumber,
  timestamp: number
}

export interface CloseParam {
  address: string,
  westTransferId?: string,
  rwaTransferId?: string,
}

export interface ClaimOverpayParam {
  address: string,
  transferId: string,
  requestId: string
}

export interface TransferParam {
  to: string,
  amount: number
}

export interface ReissueParam {
  maxWestToExchange?: number
}

export interface VaultJson {
  eastAmount: string,
  westAmount: string,
  rwaAmount: string,
  westRate: OracleJson,
  rwaRate: OracleJson,
  updatedAt: number,
  liquidationCollateral: string,
  liquidated?: boolean
}

export interface Vault {
  eastAmount: BigNumber,
  westAmount: BigNumber,
  rwaAmount: BigNumber,
  westRate: Oracle,
  rwaRate: Oracle,
  updatedAt: number,
  liquidationCollateral: BigNumber,
  liquidated?: boolean
}

export interface MintParam {
  transferId: string,
}

export interface SupplyParam {
  transferId: string
}

export interface LiquidateParam {
  address: string;
  transferId: string
}


export enum TxType {
  DockerCreate  = 103,
  DockerCall = 104
}

export enum Operations {
  mint = 'mint',
  reissue = 'reissue',
  supply = 'supply',
  transfer = 'transfer',
  close_init = 'close_init',
  close = 'close',
  liquidate = 'liquidate',
  update_config = 'update_config',
  claim_overpay_init = 'claim_overpay_init',
  claim_overpay = 'claim_overpay',
  write_liquidation_west_transfer = 'write_liquidation_west_transfer',
}

export enum StateKeys {
  totalSupply = 'total_supply',
  balance = 'balance',
  vault = 'vault',
  config = 'config',
  exchange = 'exchange',
  liquidatedVault = 'liquidated_vault',
  totalRwa = 'total_rwa',
  liquidationExchange = 'liquidation_exchange',
}

export interface ConfigParam {
  oracleContractId: string,
  oracleTimestampMaxDiff: number,
  rwaPart: BigNumber,
  westCollateral: BigNumber,
  liquidationCollateral: BigNumber,
  minHoldTime: number,
  rwaTokenId: string,
  isContractEnabled: boolean,
  adminAddress: string,
  adminPublicKey: string,
  txTimestampMaxDiff: number
}

export type TransferTx = {
  id: string,
  contract_id: string,
  sender_public_key: string,
  asset_id?: string,
  timestamp: string,
  amount: number,
  recipient: string,
  attachment?: string
}

export interface WriteLiquidationWestTransferParam {
  address: string,
  timestamp: number,
}