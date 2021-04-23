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

export interface BurnParam {
  vault: string,
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
}

export type RecalculateExecuteParam = {
  eastAmount?: number,
  westAmount?: number,
  usdpAmount?: number,
  vault: string
}


export enum TxType {
  DockerCreate  = 103,
  DockerCall = 104
}

export enum Operations {
  mint = 'mint',
  transfer = 'transfer',
  burn = 'burn',
  recalculate_init = 'recalculate_init',
  recalculate_execute = 'recalculate_execute',
}

export enum StateKeys {
  adminPublicKey = 'admin_pub_key',
  totalSupply = 'total_supply',
  balance = 'balance',
  vault = 'vault'
}
