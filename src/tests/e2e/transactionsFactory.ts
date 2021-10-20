import { WeSdk, Seed } from '@wavesenterprise/js-sdk';
import { user1SeedPhrase } from './constants'


export interface IWestTransferParams {
  amount: number,
  recipient: string,
  senderSeed: Seed,
  attachment?: string
}

export const createOracleRatesCall = (wavesApi: WeSdk, contractId: string, senderSeed: Seed, westRates = '1') => {
  return wavesApi.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    senderPublicKey: senderSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: '000003_latest',
      value: JSON.stringify({ 'value': westRates, 'timestamp': Date.now() })
    }, {
      type: 'string',
      key: '000010_latest',
      value: JSON.stringify({ 'value':'0.9978', 'timestamp': Date.now() })
    }]
  })
}

export const createWestTransfer = (wavesApi: WeSdk, params: IWestTransferParams) => {
  const { amount, recipient, senderSeed, attachment = '' } = params
  return wavesApi.API.Transactions.Transfer.V3({
    recipient,
    assetId: '',
    amount,
    timestamp: Date.now(),
    attachment,
    senderPublicKey: senderSeed.keyPair.publicKey,
    atomicBadge: {
      trustedSender: senderSeed.address
    }
  });
}

export const createMintDockerCall = (wavesApi: WeSdk, contractId: string, transferId: string, senderSeed: Seed) => {
  return wavesApi.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    senderPublicKey: senderSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'mint',
      value: JSON.stringify({
        transferId
      })
    }],
    atomicBadge: {
      trustedSender: senderSeed.address
    }
  });
}

export const createTransferDockerCall = (wavesApi: WeSdk, contractId: string, to: string, amount: number) => {
  return wavesApi.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'transfer',
      value: JSON.stringify({
        to,
        amount
      })
    }]
  });
}

export const createSupplyDockerCall = (wavesApi: WeSdk, contractId: string, transferId: string, senderSeed: Seed, isAtomic = true) => {
  const txBody: any = {
    contractId,
    contractVersion: 1,
    senderPublicKey: senderSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'supply',
      value: JSON.stringify({
        transferId
      })
    }]
  }
  if(isAtomic) {
    txBody.atomicBadge = {
      trustedSender: senderSeed.address
    }
  }
  return wavesApi.API.Transactions.CallContract.V4(txBody);
}

export const createReissueDockerCall = (wavesApi: WeSdk, contractId: string, senderSeed: Seed, maxWestToExchange: number | undefined, isAtomic = true) => {
  const txBody: any = {
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'reissue',
      value: JSON.stringify({ maxWestToExchange })
    }]
  }
  if (isAtomic) {
    txBody.atomicBadge = {
      trustedSender: senderSeed.address
    }
  }
  return wavesApi.API.Transactions.CallContract.V4(txBody)
}

export const createUpdateConfigDockerCall = (wavesApi: WeSdk, contractId: string, params: Record<any, string | number | boolean>) => {
  return wavesApi.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'update_config',
      value: JSON.stringify(params)
    }]
  })
}

export const createClaimOverpayInit = (wavesApi: WeSdk, contractId: string, amount?: string) => {
  const value = typeof amount === 'undefined'
    ? ''
    : JSON.stringify({ amount })
  const txBody = {
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'claim_overpay_init',
      value
    }]
  }
  return wavesApi.API.Transactions.CallContract.V4(txBody)
}

export interface ICreateClaimOverpayParams {
  contractId: string,
  senderSeed: Seed,
  address: string,
  transferId: string,
  requestId: string
}
export const createClaimOverpay = (wavesApi: WeSdk, params: ICreateClaimOverpayParams) => {
  const { contractId, senderSeed, address, transferId, requestId } = params
  return wavesApi.API.Transactions.CallContract.V4({
      contractId,
      contractVersion: 1,
      timestamp: Date.now(),
      params: [{
        type: 'string',
        key: 'claim_overpay',
        value: JSON.stringify( { address, transferId, requestId })
      }],
      atomicBadge: {
        trustedSender: senderSeed.address
      }
  })
}
