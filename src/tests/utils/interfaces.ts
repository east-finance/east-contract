import nodeFetch from 'node-fetch'
import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { RPCService } from "../../services/RPCService";
import { TrackTxRequest } from './east-service-api/track-tx';
import { GetTxStatusResponse } from './node-api/get-tx-status';

export type TxId = string;

export interface Globals {
  rpcService: RPCService,
  fetch?: typeof nodeFetch,
  weSdk?: WeSdk,
  keyPair?: { publicKey: string, privateKey: string },
  address?: string,
  minimumFee?: Record<string, number>,
  contractApi?: {
    createEastContract(): Promise<TxId>,
    mint(userSeed: Seed, westAmount: number): Promise<TxId>,
    supply(userSeed: Seed, westAmount: number): Promise<TxId>,
  },
  eastServiceApi?: {
    trackTx(request: TrackTxRequest): Promise<void>,
    getTxStatuses(address: string, limit: number, offset: number): any,
  },
  nodeApi?: {
    getTxStatus(txId: string): Promise<GetTxStatusResponse>,
  }
}

export type MinimumFee = Record<string, number>
