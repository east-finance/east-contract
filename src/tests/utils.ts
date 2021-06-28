import { create, MAINNET_CONFIG, WeSdk } from '@wavesenterprise/js-sdk';
import nodeFetch from 'node-fetch';
import { ContractTransactionResponse } from '../interfaces';
import { RPCService } from '../services/RPCService';
import { NODE_ADDRESS, SEED_PHRASE } from './config';

export interface Globals {
  rpcService: RPCService,
  fetch?: typeof fetch,
  weSdk?: WeSdk,
  keyPair?: { publicKey: string, privateKey: string },
  address?: string,
}

export async function initGlobals(): Promise<Required<Globals>> {
  const globals: Globals = {
    rpcService: new RPCService()
  }
  globals.fetch = (url: RequestInfo, options?: RequestInit): Promise<Response> => {
    // @ts-ignore
    return nodeFetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'x-api-key': 'we',
        'Content-Type': 'application/json',
      },
    });
  }
  const { chainId, minimumFee } = await(await globals.fetch(`${NODE_ADDRESS}/node/config`)).json()
  const wavesApiConfig = {
    ...MAINNET_CONFIG,
    nodeAddress: NODE_ADDRESS,
    crypto: 'waves',
    networkByte: chainId.charCodeAt(0),
    minimumFee
  };
  globals.weSdk = create({
    initialConfiguration: wavesApiConfig,
    fetchInstance: globals.fetch,
  });
  const seed = globals.weSdk.Seed.fromExistingPhrase(SEED_PHRASE)
  globals.address = seed.address
  globals.keyPair = seed.keyPair
  return globals as Required<Globals>
}
