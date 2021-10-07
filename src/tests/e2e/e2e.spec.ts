import { WeSdk, Seed } from '@wavesenterprise/js-sdk';
import { adminSeedPhrase, nodeAddress, serviceSeedPhrase, TxStatus, user1SeedPhrase, user2SeedPhrase } from './constants';
import { createDockerImage } from './createDockerImage';
import { createEAST } from './createEAST';
import { createWavesApi } from './createWavesApi';
import {
  createMintDockerCall,
  createSupplyDockerCall,
  createTransferDockerCall,
  createWestTransfer,
  createReissueDockerCall
} from './transactionsFactory';
import { waitForTxStatus } from './utils';

jest.setTimeout(15 * 60 * 1000)

let imageHash = '59c1500b60e31fb3131245274ba5eff683f498aaa18e97d20962ec589dd00098'
let wavesApi: WeSdk
let adminSeed: Seed
let serviceSeed: Seed
let user1Seed: Seed
let user2Seed: Seed

let eastContractId = ''

beforeAll(async () => {
  if (!imageHash) {
    imageHash = await createDockerImage()
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

describe("EAST mint", () => {
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

  test('Mint with less than 1 EAST (should be failed)', async () => {
    const mintStatus = await basicMint(0.01 * Math.pow(10, 8))
    expect(mintStatus.status).toBe(TxStatus.error);
  });

  test('Mint', async () => {
    const mintStatus = await basicMint(5 * Math.pow(10, 8))
    expect(mintStatus.status).toBe(TxStatus.success);
  });

  // test('Mint with existed vault (should be failed)', async () => {
  //   const mintStatus = await basicMint(5 * Math.pow(10, 8))
  //   expect(mintStatus.status).toBe(TxStatus.error);
  // });
})

describe("EAST supply", () => {
  test('Supply and reissue', async () => {
    const transfer = createWestTransfer(wavesApi, { amount: 2 * Math.pow(10, 8), recipient: serviceSeed.address, senderSeed: user1Seed })
    const transferId = await transfer.getId(user1Seed.keyPair.publicKey)
    const supply = createSupplyDockerCall(wavesApi, eastContractId, transferId, user1Seed)
    const reissue = createReissueDockerCall(wavesApi, eastContractId, user1Seed, 2 * Math.pow(10, 8))
    const reissueId = await reissue.getId(user1Seed.keyPair.publicKey)

    await wavesApi.API.Transactions.broadcastAtomic(
      wavesApi.API.Transactions.Atomic.V1({transactions: [transfer, supply, reissue]}),
      user1Seed.keyPair
    );
    const txStatus = await waitForTxStatus(nodeAddress, reissueId)
    expect(txStatus.status).toBe(TxStatus.success);
  });
})

describe("EAST transfer", () => {
  test('Transfer from user1 to user2', async () => {
    const transfer = createTransferDockerCall(wavesApi, eastContractId, user2Seed.address, 1)
    const transferId = await transfer.getId(user1Seed.keyPair.publicKey)
    await transfer.broadcast(user1Seed.keyPair);
    const txStatus = await waitForTxStatus(nodeAddress, transferId)
    expect(txStatus.status).toBe(TxStatus.success);
  });

  test('Transfer from user2 to user1', async () => {
    const transfer = createTransferDockerCall(wavesApi, eastContractId, user1Seed.address, 1)
    const transferId = await transfer.getId(user2Seed.keyPair.publicKey)
    await transfer.broadcast(user2Seed.keyPair);
    const txStatus = await waitForTxStatus(nodeAddress, transferId)
    expect(txStatus.status).toBe(TxStatus.success);
  });

  test('Transfer from user2 to user1 again (should be failed)', async () => {
    const transfer = createTransferDockerCall(wavesApi, eastContractId, user1Seed.address, 1)
    const transferId = await transfer.getId(user2Seed.keyPair.publicKey)
    await transfer.broadcast(user2Seed.keyPair);
    const txStatus = await waitForTxStatus(nodeAddress, transferId)
    expect(txStatus.status).toBe(TxStatus.error);
  });
})
