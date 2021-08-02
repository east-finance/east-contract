import { writeFileSync } from "fs";
import { NODE_ADDRESS, PATH_TO_USER_SEEDS } from "../config";
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

async function main(count: number = 1, westAmount = 3) {
  const { weSdk, minimumFee, keyPair, fetch } = await initGlobals()
  const result: any = {
    seeds: []
  }
  for (let i = 0; i < count; i++) {
    const seedPhrase = generateUserSeedPhrase()
    result.seeds.push(seedPhrase)
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
    await transferCall.broadcast(keyPair)
    const pollingResult = await runPolling({
      sourceFn: async () => {
        const { json } = await fetch(`${NODE_ADDRESS}/transactions/info/${txId}`)
        return json()
      },
      predicateFn: (result: any) => {
        console.log(result)
        return false
      },
      pollInterval: 1000,
      timeout: 30000,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      console.log('Timeout error')
      return
    }
    console.log(pollingResult)
  }
  writeFileSync(PATH_TO_USER_SEEDS!, JSON.stringify(result))
}

const count: number | undefined = process.env.COUNT === undefined ? undefined : parseInt(process.env.COUNT, 10)

const westAmount: number | undefined = process.env.WEST === undefined ? undefined : parseFloat(process.env.WEST)

main(count, westAmount)
