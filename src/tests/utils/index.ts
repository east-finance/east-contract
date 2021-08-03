import { create, MAINNET_CONFIG, Seed } from '@wavesenterprise/js-sdk';
import nodeFetch from 'node-fetch';
import { RPCService } from '../../services/RPCService';
import { CONTRACT_ID, NODE_ADDRESS, SEED_PHRASE } from '../config';
import { createEastContract } from './contract-api/create-east-contract';
import { mint } from './contract-api/mint';
import { getTxStatuses } from './east-service-api/get-tx-statuses';
import { trackTx, TrackTxRequest } from './east-service-api/track-tx';
import { Globals } from './interfaces';
import { getTxStatus } from './node-api/get-tx-status';

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
  globals.minimumFee = minimumFee;
  const weSdk = create({
    initialConfiguration: wavesApiConfig,
    fetchInstance: globals.fetch,
  })
  globals.weSdk = weSdk;
  const seed = globals.weSdk.Seed.fromExistingPhrase(SEED_PHRASE)
  globals.address = seed.address
  globals.keyPair = seed.keyPair
  const contractApi = {
    createEastContract: () => {
      return createEastContract(weSdk, seed)
    },
    mint: (userSeed: Seed, westAmount: number) => {
      return mint({
        contractId: CONTRACT_ID!,
        minimumFee,
        ownerSeed: seed,
        userSeed,
        weSdk,
        westAmount,
      })
    }
  }
  globals.contractApi = contractApi
  const eastServiceApi = {
    trackTx: (request: TrackTxRequest) => {
      return trackTx(fetch, request)
    },
    getTxStatuses: (address: string, limit: number, offset: number) => {
      return getTxStatuses(fetch, address, limit, offset)
    }
  }
  globals.eastServiceApi = eastServiceApi
  const nodeApi = {
    getTxStatus: (txId: string) => {
      return getTxStatus(fetch, txId)
    }
  }
  globals.nodeApi = nodeApi;
  return globals as Required<Globals>
}
