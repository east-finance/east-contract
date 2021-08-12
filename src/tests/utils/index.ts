import { ApiTokenRefresher } from '@wavesenterprise/api-token-refresher';
import { TokenPair } from '@wavesenterprise/api-token-refresher/types';
import { create, MAINNET_CONFIG, Seed } from '@wavesenterprise/js-sdk';
import { Transfer } from '@wavesenterprise/js-sdk/raw/src/grpc/compiled-web/transfer_pb';
import nodeFetch from 'node-fetch';
import { ConfigParam } from '../../interfaces';
import { RPCService } from '../../services/RPCService';
import { AUTH_PASSWORD, AUTH_SERVICE_ADDRESS, AUTH_USERNAME, CONTRACT_ID, NODE_ADDRESS, ORACLE_CONTRACT_ID, RWA_TOKEN_ID, SEED_PHRASE } from '../config';
import { closeInit } from './contract-api/close-init';
import { createEastContract } from './contract-api/create-east-contract';
import { liquidate } from './contract-api/liquidate';
import { mint } from './contract-api/mint';
import { reissue } from './contract-api/reissue';
import { supply } from './contract-api/supply';
import { updateConfig } from './contract-api/update-config';
import { getLiquidatableVaults } from './east-service-api/get-liquidatable-vaults';
import { getTxStatuses } from './east-service-api/get-tx-statuses';
import { trackTx, TrackTxRequest } from './east-service-api/track-tx';
import { getContractState } from './node-api/get-contract-state';
import { getTransactionInfo } from './node-api/get-transaction-info';
import { getTxStatus } from './node-api/get-tx-status';
import { transfer } from './node-api/transfer';
import { updateRates } from './oracle-contract-api/update-rates';
import { createRandomSeed } from './utils/create-random-seed';

async function getTokens(): Promise<TokenPair> {
  const data = await nodeFetch(`${AUTH_SERVICE_ADDRESS}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: AUTH_USERNAME,
      password: AUTH_PASSWORD,
    }),
  })
  return data.json() as Promise<TokenPair>
}

async function refreshCallback (token: string): Promise<TokenPair> {
  try {
    const data = await nodeFetch(`${AUTH_SERVICE_ADDRESS}/v1/auth/refresh`, {      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },  
      body: JSON.stringify({
        token,
      })
    })
    return data.json() as Promise<TokenPair>
  } catch (e) {
    return getTokens()
  }
}

export async function initGlobals() {
  const tokens = await getTokens()
  const apiTokenRefresher = new ApiTokenRefresher({
      authorization: tokens,
      refreshCallback,
   })
  const { fetch: authorizedFetch } = apiTokenRefresher.init()
  const rpcService = new RPCService()
  const fetch = ((url: RequestInfo, options?: RequestInit): Promise<Response> => {
    // @ts-ignore
    return authorizedFetch(url, {
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
    reissue: (userSeed: Seed, maxWestToExchange?: number) => {
      return reissue({
        contractId: CONTRACT_ID!,
        minimumFee,
        userSeed,
        weSdk,
        maxWestToExchange,
      })
    },
    closeInit: (userSeed: Seed) => {
      return closeInit({
        contractId: CONTRACT_ID!,
        minimumFee,
        userSeed,
        weSdk,
      })
    },
    liquidate: (userSeed: Seed, liquidatableVaultAddress: string, rwaAmount: number) => {
      return liquidate({
        contractId: CONTRACT_ID!,
        minimumFee,
        ownerSeed: seed,
        rwaTokenId: RWA_TOKEN_ID,
        weSdk,
        userSeed,
        liquidatableVaultAddress,
        rwaAmount,
      })
    },
    updateConfig: (config: ConfigParam) => {
      return updateConfig({
        config,
        contractId: CONTRACT_ID!,
        minimumFee,
        ownerSeed: seed,
        weSdk,
      })
    },
  }
  const eastServiceApi = {
    trackTx: (request: TrackTxRequest) => {
      return trackTx(fetch, request)
    },
    getTxStatuses: (address: string, limit: number, offset: number) => {
      return getTxStatuses(fetch, address, limit, offset)
    },
    getLiquidatableVaults: () => {
      return getLiquidatableVaults(fetch)
    },
  }
  const nodeApi = {
    getTxStatus: (txId: string) => {
      return getTxStatus(fetch, txId)
    },
    getContractState: (limit: number, offset: number = 0) => {
      return getContractState(fetch, ORACLE_CONTRACT_ID, limit, offset)
    },
    transfer: (namedArgs: { amount: number, senderSeed: Seed, recipientAddress: string, assetId: string }) => {
      const { amount, senderSeed, recipientAddress, assetId } = namedArgs;
      return transfer({
        amount,
        minimumFee,
        assetId,
        recipientAddress,
        senderKeyPair: senderSeed.keyPair,
        weSdk,
      })
    },
    getTransactionInfo: (txId: string) => {
      return getTransactionInfo(fetch, txId)
    }
  }
  const oracleContractApi = {
    updateRates: (namedArgs: { west?: number, rwa?: number }) => {
      const { west, rwa } = namedArgs;
      return updateRates({
        contractId: ORACLE_CONTRACT_ID,
        minimumFee,
        userSeed: seed,
        weSdk,
        west,
        rwa,
      })
    }
  }
  const utils = {
    createRandomSeed: () => {
      return createRandomSeed(weSdk)
    }
  }
  return {
    rpcService,
    fetch,
    weSdk,
    contractApi,
    eastServiceApi,
    oracleContractApi,
    utils,
    nodeApi,
    seed,
    minimumFee,
  }
}
