import { create, MAINNET_CONFIG, Seed } from '@wavesenterprise/js-sdk';
import nodeFetch from 'node-fetch';
import { ConfigParam } from '../../interfaces';
import { RPCService } from '../../services/RPCService';
import { CONTRACT_ID, NODE_ADDRESS, ORACLE_CONTRACT_ID, SEED_PHRASE } from '../config';
import { createEastContract } from './contract-api/create-east-contract';
import { mint } from './contract-api/mint';
import { reissue } from './contract-api/reissue';
import { supply } from './contract-api/supply';
import { getTxStatuses } from './east-service-api/get-tx-statuses';
import { trackTx, TrackTxRequest } from './east-service-api/track-tx';
import { getTxStatus } from './node-api/get-tx-status';
import { updateRates } from './oracle-contract-api/update-rates';

export async function initGlobals() {
  const rpcService = new RPCService()
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
  const { chainId, minimumFee } = await(await fetch(`${NODE_ADDRESS}/node/config`)).json()
  const wavesApiConfig = {
    ...MAINNET_CONFIG,
    nodeAddress: NODE_ADDRESS,
    crypto: 'waves',
    networkByte: chainId.charCodeAt(0),
    minimumFee
  }
  const weSdk = create({
    initialConfiguration: wavesApiConfig,
    fetchInstance: fetch,
  })
  const seed = weSdk.Seed.fromExistingPhrase(SEED_PHRASE)
  const contractApi = {
    createEastContract: (config: ConfigParam) => {
      return createEastContract(weSdk, seed, config)
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
    },
    supply: (userSeed: Seed, westAmount: number) => {
      return supply({
        contractId: CONTRACT_ID!,
        minimumFee,
        ownerAddress: seed.address,
        userSeed,
        weSdk,
        westAmount,
      })
    },
    reissue: (userSeed: Seed) => {
      return reissue({
        contractId: CONTRACT_ID!,
        minimumFee,
        userSeed,
        weSdk,
      })
    }
  }
  const eastServiceApi = {
    trackTx: (request: TrackTxRequest) => {
      return trackTx(fetch, request)
    },
    getTxStatuses: (address: string, limit: number, offset: number) => {
      return getTxStatuses(fetch, address, limit, offset)
    }
  }
  const nodeApi = {
    getTxStatus: (txId: string) => {
      return getTxStatus(fetch, txId)
    }
  }
  const oracleContractApi = {
    updateRates: (namedArgs: { westRate?: number, rwaRate?: number }) => {
      const { rwaRate, westRate } = namedArgs;
      return updateRates({
        contractId: ORACLE_CONTRACT_ID,
        minimumFee,
        userSeed: seed,
        weSdk,
        rwaRate,
        westRate,
      })
    }
  }
  return {
    rpcService,
    fetch,
    weSdk,
    contractApi,
    eastServiceApi,
    oracleContractApi,
    nodeApi,
    seed,
    minimumFee,
  }
}
