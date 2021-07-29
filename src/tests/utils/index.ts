import { create, MAINNET_CONFIG, WeSdk } from '@wavesenterprise/js-sdk';
import nodeFetch from 'node-fetch';
import { RPCService } from '../../services/RPCService';
import { NODE_ADDRESS, SEED_PHRASE } from '../config';
import { createEastContract } from './create-east-contract';
import { trackTx, TrackTxRequest } from './east-service-api/track-tx';
import { Globals } from './interfaces';

export async function initGlobals(): Promise<Required<Globals>> {
  const globals: Globals = {
    rpcService: new RPCService(),
  }
  const fetch = ((url: RequestInfo, options?: RequestInit): Promise<Response> => {
    // @ts-ignore
    return nodeFetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'x-api-key': 'we',
        'Content-Type': 'application/json',
      },
    });
  }) as unknown as typeof nodeFetch;
  globals.fetch = fetch;
  const { chainId, minimumFee } = await(await globals.fetch(`${NODE_ADDRESS}/node/config`)).json()
  const wavesApiConfig = {
    ...MAINNET_CONFIG,
    nodeAddress: NODE_ADDRESS,
    crypto: 'waves',
    networkByte: chainId.charCodeAt(0),
    minimumFee
  };
  const weSdk = create({
    initialConfiguration: wavesApiConfig,
    fetchInstance: globals.fetch,
  })
  globals.weSdk = weSdk;
  const seed = globals.weSdk.Seed.fromExistingPhrase(SEED_PHRASE)
  globals.address = seed.address
  globals.keyPair = seed.keyPair
  globals.createEastContract = () => {
    return createEastContract(weSdk, seed)
  }
  globals.trackTx = (request: TrackTxRequest) => {
    return trackTx(fetch, request)
  }
  return globals as Required<Globals>
}