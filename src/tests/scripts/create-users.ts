import { writeFileSync } from "fs";
import { NODE_ADDRESS, PATH_TO_USER_SEEDS, RWA_TOKEN_ID } from "../config";
import { initGlobals } from "../utils";
import { PollingTimeoutError, runPolling } from "../utils/polling";

function generateWord(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

function generateUserSeedPhrase() {
  let result = ''
  for (let i = 0; i < 5; i++) {
    result = result + generateWord(5) + ' '
  }
  return result.slice(0, -1)
}

async function main(count: number = 1, westAmount = 3, rwaAmount = 1) {
  const { weSdk, minimumFee, seed: ownerSeed, fetch } = await initGlobals()
  let pollingResults = []
  const result: any = {
    seeds: []
  }
  for (let i = 0; i < count; i++) {
    const seedPhrase = generateUserSeedPhrase()
    result.seeds.push(seedPhrase)
    const seed = weSdk.Seed.fromExistingPhrase(seedPhrase)
    const westTransferCall = weSdk.API.Transactions.Transfer.V3({
      recipient: seed.address,
      assetId: '',
      amount: westAmount * 100000000,
      timestamp: Date.now(),
      attachment: '',
      fee: minimumFee[4],
      senderPublicKey: ownerSeed.keyPair.publicKey,
    });
    const westTransferTxId = await westTransferCall.getId(ownerSeed.keyPair.publicKey)
    pollingResults.push(
      runPolling({
        sourceFn: async () => {
          const data = await fetch(`${NODE_ADDRESS}/transactions/info/${westTransferTxId}`)
          return data.json()
        },
        predicateFn: (result: any) => {
          return result.id !== undefined && result.id === westTransferTxId
        },
        pollInterval: 1000,
        timeout: 30000,
      })
    )
    westTransferCall.broadcast(ownerSeed.keyPair)

    const rwaTransferCall = weSdk.API.Transactions.Transfer.V3({
      recipient: seed.address,
      assetId: RWA_TOKEN_ID,
      amount: westAmount * 100000000,
      timestamp: Date.now(),
      attachment: '',
      fee: minimumFee[4],
      senderPublicKey: ownerSeed.keyPair.publicKey,
    });
    const rwaTransferTxId = await rwaTransferCall.getId(ownerSeed.keyPair.publicKey)
    pollingResults.push(
      runPolling({
        sourceFn: async () => {
          const data = await fetch(`${NODE_ADDRESS}/transactions/info/${rwaTransferTxId}`)
          return data.json()
        },
        predicateFn: (result: any) => {
          return result.id !== undefined && result.id === rwaTransferTxId
        },
        pollInterval: 1000,
        timeout: 30000,
      })
    )
    rwaTransferCall.broadcast(ownerSeed.keyPair)
  }
  pollingResults = await Promise.all(pollingResults)
  console.log(pollingResults)
  writeFileSync(PATH_TO_USER_SEEDS!, JSON.stringify(result))
}

const count: number | undefined = process.env.COUNT === undefined ? undefined : parseInt(process.env.COUNT, 10)

const westAmount: number | undefined = process.env.WEST === undefined ? undefined : parseFloat(process.env.WEST)

const rwaAmount: number | undefined = process.env.RWA === undefined ? undefined : parseFloat(process.env.RWA)

main(count, westAmount, rwaAmount)
