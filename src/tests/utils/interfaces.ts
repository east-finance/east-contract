import nodeFetch from 'node-fetch'
import { WeSdk } from "@wavesenterprise/js-sdk";
import { RPCService } from "../../services/RPCService";
import { TrackTxRequest } from './east-service-api/track-tx';

export type ContractId = string;

export interface Globals {
  rpcService: RPCService,
  fetch?: typeof nodeFetch,
  weSdk?: WeSdk,
  keyPair?: { publicKey: string, privateKey: string },
  address?: string,
  createEastContract?(): Promise<ContractId>,
  trackTx?(request: TrackTxRequest): Promise<void>,
}

export type MinimumFee = Record<string, number>
