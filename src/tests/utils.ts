import { create, MAINNET_CONFIG, WeSdk } from '@wavesenterprise/js-sdk';
import nodeFetch from 'node-fetch';
import { Transaction } from '../interfaces';
import { RPCService } from '../services/RPCService';
import { NODE_ADDRESS, SEED_PHRASE } from './config';

export interface Globals {
  rpcService: RPCService,
  createTx(type: 103 | 104, methodKey: string, methodBody: Record<string, any>): Transaction,
  fetch?: typeof fetch,
  weSdk?: WeSdk,
  keyPair?: { publicKey: string, privateKey: string },
  address?: string,
}

export async function initGlobals(): Promise<Required<Globals>> {
  const globals: Globals = {
    rpcService: new RPCService(),
    createTx: (type: 103 | 104, methodKey: string, methodBody: Record<string, any>) => {
      return {
        id: '',
        type: 103,
        sender: 'sender',
        sender_public_key: 'pk',
        contract_id: 'contract_id',
        fee: 1000,
        version: 1,
        proofs: Buffer.from(''),
        timestamp: Date.now(),
        fee_asset_id: {
          value: 'fee_asset_id',
        },
        params: [
          {
            key: methodKey,
            value: 'string_value',
            string_value: JSON.stringify(methodBody)
          }
        ],
      }
    },
  };
  (globals.rpcService as any).stateService.commitSuccess = () => {}
  (globals.rpcService as any).stateService.getConfig = () => ({
    issueEnabled: true
  })
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
