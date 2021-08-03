import { readFileSync } from "fs";
import { NODE_ADDRESS, PATH_TO_USER_SEEDS } from "../config";
import { initGlobals } from "../utils";
import { PollingTimeoutError, runPolling } from "../utils/polling";

async function main(westAmount = 3) {
  const { weSdk, minimumFee, keyPair, fetch } = await initGlobals()
  const userSeedsResult = readFileSync(PATH_TO_USER_SEEDS!)
  const parsedUserSeedsResult = JSON.parse(userSeedsResult.toString())
  let pollingResults: any[] = []
  parsedUserSeedsResult.seeds.forEach(async (seedPhrase: string) => {
    const seed = weSdk.Seed.fromExistingPhrase(seedPhrase)
    const transferCall = weSdk.API.Transactions.Transfer.V3({
      recipient: seed.address,
      assetId: '',
      amount: westAmount * 100000000,
      timestamp: Date.now(),
      attachment: '',
      fee: minimumFee[4],
      senderPublicKey: keyPair.publicKey,
    });
    const txId = await transferCall.getId(keyPair.publicKey)
    pollingResults.push(
      runPolling({
        sourceFn: async () => {
          const data = await fetch(`${NODE_ADDRESS}/transactions/info/${txId}`)
          return data.json()
        },
        predicateFn: (result: any) => {
          return result.id !== undefined && result.id === txId
        },
        pollInterval: 1000,
        timeout: 30000,
      })
    )
    transferCall.broadcast(keyPair)
  });
  pollingResults = await Promise.all(pollingResults)
  console.log(pollingResults)
}

const westAmount: number | undefined = process.env.WEST === undefined ? undefined : parseFloat(process.env.WEST)

main(westAmount)
