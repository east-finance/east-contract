import { WeSdk, Seed } from '@wavesenterprise/js-sdk';
import { adminSeedPhrase, nodeAddress, oracleContractId,
  OracleStream, serviceSeedPhrase, TxStatus, user1SeedPhrase, user2SeedPhrase } from './constants';
import { buildDockerImage } from './buildDockerImage';
import { createEAST } from './createEAST';
import { createWavesApi } from './createWavesApi';
import {
  createMintDockerCall,
  createSupplyDockerCall,
  createTransferDockerCall,
  createWestTransfer,
  createReissueDockerCall,
  createOracleRatesCall,
  createUpdateConfigDockerCall,
  createClaimOverpayInit,
  createClaimOverpay
} from './transactionsFactory';
import { getContractStateKeyValue, waitForTxStatus } from './utils';

jest.setTimeout(15 * 60 * 1000)

let imageHash = ''
let wavesApi: WeSdk
let adminSeed: Seed
let serviceSeed: Seed
let user1Seed: Seed
let user2Seed: Seed

let eastContractId = ''

const baseSupply = async (senderSeed: Seed, recipientAddress: string, amount: number) => {
  const transfer = createWestTransfer(wavesApi, { amount, recipient: recipientAddress, senderSeed })
  const transferId = await transfer.getId(senderSeed.keyPair.publicKey)
  const supply = createSupplyDockerCall(wavesApi, eastContractId, transferId, senderSeed)
  const supplyId = await supply.getId(senderSeed.keyPair.publicKey)
  await wavesApi.API.Transactions.broadcastAtomic(
    wavesApi.API.Transactions.Atomic.V1({transactions: [transfer, supply]}),
    senderSeed.keyPair
  );
  return waitForTxStatus(nodeAddress, supplyId)
}

beforeAll(async () => {
  if (!imageHash) {
    imageHash = await buildDockerImage()
  }
  wavesApi = await createWavesApi()
  adminSeed = wavesApi.Seed.fromExistingPhrase(adminSeedPhrase);
  serviceSeed = wavesApi.Seed.fromExistingPhrase(serviceSeedPhrase);
  user1Seed = wavesApi.Seed.fromExistingPhrase(user1SeedPhrase);
  user2Seed = wavesApi.Seed.fromExistingPhrase(user2SeedPhrase);
})

describe("Create EAST contract", () => {
  test('Create EAST contract', async () => {
    eastContractId = await createEAST(wavesApi, imageHash)
    expect(typeof eastContractId).toBe('string');
    expect(eastContractId.length).toBeGreaterThan(0);
    const createStatus = await waitForTxStatus(nodeAddress, eastContractId)
    expect(createStatus.status).toBe(TxStatus.success);
  });
});

describe("Data oracles", () => {
  test('Set oracle WEST rates', async () => {
    const oracleValue = '1'
    const call = createOracleRatesCall(wavesApi, oracleContractId, adminSeed, oracleValue)
    const txId = await call.getId(adminSeed.keyPair.publicKey)
    await call.broadcast(adminSeed.keyPair);
    const execution = await waitForTxStatus(nodeAddress, txId)
    const oracleRates = await getContractStateKeyValue(nodeAddress, oracleContractId, OracleStream.WEST)
    expect(execution.status).toBe(TxStatus.success);
    expect(JSON.parse(oracleRates.value).value).toBe(oracleValue);
  });
})

describe("Mint", () => {
  const basicMint = async (amount = 5 * Math.pow(10, 8)) => {
    const transfer = createWestTransfer(wavesApi, { amount, recipient: serviceSeed.address, senderSeed: user1Seed })
    const transferId = await transfer.getId()
    const mint = createMintDockerCall(wavesApi, eastContractId, transferId, user1Seed)
    const mintTxId = await mint.getId()
    await wavesApi.API.Transactions.broadcastAtomic(
      wavesApi.API.Transactions.Atomic.V1({transactions: [transfer, mint]}),
      user1Seed.keyPair
    );
    const mintStatus = await waitForTxStatus(nodeAddress, mintTxId)
    return mintStatus
  }

  test('Check mint with less than 1 EAST (should be failed)', async () => {
    const mintStatus = await basicMint(0.01 * Math.pow(10, 8))
    expect(mintStatus.status).toBe(TxStatus.error);
  });

  test('Check positive case', async () => {
    const mintStatus = await basicMint(5 * Math.pow(10, 8))
    const user1Balance = await getContractStateKeyValue(nodeAddress, eastContractId, `balance_${user1Seed.address}`)
    expect(mintStatus.status).toBe(TxStatus.success);
    expect(user1Balance.value).toBe('200000000');
  });

  test('Cehck mint with existed vault (should be failed)', async () => {
    const mintStatus = await basicMint(5 * Math.pow(10, 8))
    expect(mintStatus.status).toBe(TxStatus.error);
  });
})

describe("Supply", () => {
  test('Check positive case', async () => {
    const txStatus = await baseSupply(user1Seed, serviceSeed.address, 2 * Math.pow(10, 8))
    const user1Balance = await getContractStateKeyValue(nodeAddress, eastContractId, `balance_${user1Seed.address}`)
    expect(txStatus.status).toBe(TxStatus.success);
    expect(user1Balance.value).toBe('200000000');
  });

  test('Check supply vault without transfer (should be failed)', async () => {
    const supply = createSupplyDockerCall(wavesApi, eastContractId, '', user1Seed, false)
    const supplyId = await supply.getId(user1Seed.keyPair.publicKey)
    await supply.broadcast(user1Seed.keyPair)
    const result = await waitForTxStatus(nodeAddress, supplyId)
    expect(result.status).toBe(TxStatus.error);
    expect(result.message.includes('is not found in blockchain')).toBeTruthy();
  });
})

describe("Reissue", () => {
  test('Check positive case', async () => {
    const reissue = createReissueDockerCall(wavesApi, eastContractId, user1Seed, 9999 * Math.pow(10, 8), false)
    const reissueId = await reissue.getId(user1Seed.keyPair.publicKey)
    await reissue.broadcast(user1Seed.keyPair)
    const txStatus = await waitForTxStatus(nodeAddress, reissueId)
    const user1Balance = await getContractStateKeyValue(nodeAddress, eastContractId, `balance_${user1Seed.address}`)
    expect(txStatus.status).toBe(TxStatus.success);
    expect(user1Balance.value).toBe('280000000');
  });

  test('Check reissue with non-profitable vault (should be failed)', async () => {
    const reissue = createReissueDockerCall(wavesApi, eastContractId, user1Seed, 9999 * Math.pow(10, 8), false)
    const reissueId = await reissue.getId(user1Seed.keyPair.publicKey)
    await reissue.broadcast(user1Seed.keyPair)
    const txStatus = await waitForTxStatus(nodeAddress, reissueId)
    expect(txStatus.status).toBe(TxStatus.error);
  });
})

describe("Transfer", () => {
  const transferFromUser1toUser2 = async (amount: any) => {
    const transfer = createTransferDockerCall(wavesApi, eastContractId, user2Seed.address, amount)
    const transferId = await transfer.getId(user1Seed.keyPair.publicKey)
    await transfer.broadcast(user1Seed.keyPair)
    const txStatus = await waitForTxStatus(nodeAddress, transferId)
    return txStatus
  }

  test('Check transfer from user1 to user2', async () => {
    const txStatus = await transferFromUser1toUser2(1)
    const user1Balance = await getContractStateKeyValue(nodeAddress, eastContractId, `balance_${user1Seed.address}`)
    const user2Balance = await getContractStateKeyValue(nodeAddress, eastContractId, `balance_${user2Seed.address}`)
    expect(txStatus.status).toBe(TxStatus.success)
    expect(user1Balance.value).toBe('279999999')
    expect(user2Balance.value).toBe('1')
  });

  test('Check transfer back from user2 to user1', async () => {
    const transfer = createTransferDockerCall(wavesApi, eastContractId, user1Seed.address, 1)
    const transferId = await transfer.getId(user2Seed.keyPair.publicKey)
    await transfer.broadcast(user2Seed.keyPair);
    const txStatus = await waitForTxStatus(nodeAddress, transferId)
    const user1Balance = await getContractStateKeyValue(nodeAddress, eastContractId, `balance_${user1Seed.address}`)
    const user2Balance = await getContractStateKeyValue(nodeAddress, eastContractId, `balance_${user2Seed.address}`)
    expect(txStatus.status).toBe(TxStatus.success);
    expect(user1Balance.value).toBe('280000000')
    expect(user2Balance.value).toBe('0')
  });

  test('Check transfer insufficient funds (should be failed)', async () => {
    const txStatus = await transferFromUser1toUser2(10 * Math.pow(10, 8))
    expect(txStatus.status).toBe(TxStatus.error);
  });

  test('Check transfer negative amount (should be failed)', async () => {
    const txStatus = await transferFromUser1toUser2(-1)
    expect(txStatus.status).toBe(TxStatus.error);
  });
})

describe('Claim overpay', () => {
  const claimOverpayServiceFee = 0.2
  const baseClaimOverpayInit = async (senderSeed: Seed, amount?: string) => {
    const claim = createClaimOverpayInit(wavesApi, eastContractId, amount)
    await claim.broadcast(senderSeed.keyPair);
    return waitForTxStatus(nodeAddress, await claim.getId(senderSeed.keyPair.publicKey))
  }
  const baseClaimOverpay = async (senderSeed: Seed, recipientAddress: string, transferAttachment: string, amount: number) => {
    const transfer = createWestTransfer(wavesApi, { senderSeed, recipient: recipientAddress, amount })
    const transferId = await transfer.getId(senderSeed.keyPair.publicKey)

    const claim = createClaimOverpay(wavesApi, {
      contractId: eastContractId,
      senderSeed,
      address: recipientAddress,
      transferId,
      requestId: transferAttachment
    })

    const claimId = await claim.getId(senderSeed.keyPair.publicKey)
    await wavesApi.API.Transactions.broadcastAtomic(
      wavesApi.API.Transactions.Atomic.V1({transactions: [transfer, claim]}),
      senderSeed.keyPair
    );
    return waitForTxStatus(nodeAddress, claimId)
  }

  test('Check serviceAddress protection (should be failed)', async () => {
    const claimStatus = await baseClaimOverpay(user1Seed, user1Seed.address, '', 1)
    expect(claimStatus.status).toBe(TxStatus.error)
    expect(claimStatus.message.includes('match tx sender public key')).toBeTruthy()
  })

  test('Check operation with amount as empty string (should be failed)', async () => {
    const txStatus = await baseClaimOverpayInit(user1Seed, '')
    expect(txStatus.status).toBe(TxStatus.error);
    expect(txStatus.message.includes('Validation error')).toBeTruthy();
  });

  test('Check operation with amount as alphabetic string (should be failed)', async () => {
    const txStatus = await baseClaimOverpayInit(user1Seed, 'abc123')
    expect(txStatus.status).toBe(TxStatus.error);
    expect(txStatus.message.includes('Validation error')).toBeTruthy();
  });

  test('Check operation without free WEST (should be failed)', async () => {
    const txStatus = await baseClaimOverpayInit(user1Seed, Number(2 * Math.pow(10, 8)).toString())
    expect(txStatus.status).toBe(TxStatus.error);
    expect(txStatus.message.includes('No WEST for withdraw from vault')).toBeTruthy();
  });

  test('Check positive case', async () => {
    const amount = 0.87654321 * Math.pow(10, 8)
    const supplyStatus = await baseSupply(user1Seed, serviceSeed.address, amount)
    const claimInitStatus = await baseClaimOverpayInit(user1Seed) // withdraw all available WEST
    const returnAmount = amount - claimOverpayServiceFee * Math.pow(10, 8)
    const claimStatus = await baseClaimOverpay(serviceSeed, user1Seed.address, '', returnAmount)
    const vault = await getContractStateKeyValue(nodeAddress, eastContractId, `vault_${user1Seed.address}`)
    const vaultParsed = JSON.parse(vault.value)
    expect(supplyStatus.status).toBe(TxStatus.success)
    expect(claimInitStatus.status).toBe(TxStatus.success)
    expect(claimStatus.status).toBe(TxStatus.success)
    expect(vaultParsed.eastAmount).toBe('280000000')
    expect(vaultParsed.westAmount).toBe('700000000')
  });
})

describe('Update config', () => {
  const baseUpdateConfig = async (senderSeed: Seed, params: Record<any, string | number | boolean>) => {
    const updateConfig = createUpdateConfigDockerCall(wavesApi, eastContractId, params)
    const txId = await updateConfig.getId(senderSeed.keyPair.publicKey)
    await updateConfig.broadcast(senderSeed.keyPair);
    return waitForTxStatus(nodeAddress, txId)
  }

  test('Check adminAddress protection (should be failed)', async () => {
    const txStatus = await baseUpdateConfig(user1Seed, { isContractEnabled: false })
    expect(txStatus.status).toBe(TxStatus.error);
    expect(txStatus.message.includes('match tx sender public key')).toBeTruthy();
  });

  test('Check positive case', async () => {
    const oracleTimestampMaxDiff = 61 * 1000
    const txStatus = await baseUpdateConfig(adminSeed, { oracleTimestampMaxDiff })
    const config = await getContractStateKeyValue(nodeAddress, eastContractId, 'config')
    expect(JSON.parse(config.value).oracleTimestampMaxDiff).toBe(oracleTimestampMaxDiff);
  });
})
