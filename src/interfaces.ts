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

export interface Oracle {
  value: number,
  timestamp: string
}

export interface BurnParam {
  vaultId: string,
}

export interface LiquidateParam {
  vaultId: string,
}

export interface TransferParam {
  to: string,
  eastAmount: number
}

export interface Vault {
  address: string,
  eastAmount: number,
  westAmount: number,
  usdpAmount: number,
  westRateTimestamp: number,
  usdpRateTimestamp: number,
  liquidated?: boolean
}

export interface MintParam {
  transferId: string,
}

export interface SupplyParam {
  transferId: string,
  vaultId: string
}

export type RecalculateParam = {
  vaultId: string
}


export enum TxType {
  DockerCreate  = 103,
  DockerCall = 104
}

export enum Operations {
  mint = 'mint',
  recalculate = 'recalculate',
  supply = 'supply',
  transfer = 'transfer',
  burn_init = 'burn_init',
  burn = 'burn',
  liquidate = 'liquidate',
  update_config = 'update_config',
}

export enum StateKeys {
  totalSupply = 'total_supply',
  balance = 'balance',
  vault = 'vault',
  config = 'config',
  exchange = 'exchange'
}

export interface ConfigParam {
  oracleContractId: string,
  oracleTimestampMaxDiff: number,
  usdpPart: number,
  westCollateral: number,
  liquidationCollateral: number,
  minHoldTime: number,
  USDapTokenId: string,
  adminAddress: string,
  adminPublicKey: string
}

export type TransferTx = {
  id: string,
  contract_id: string,
  sender_public_key: string,
  timestamp: string,
  amount: number,
  recipient: string
}