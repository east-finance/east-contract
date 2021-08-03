import { readFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "./config";
import { initGlobals } from "./utils";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "./utils/polling";

async function main() {
  const globals = await initGlobals();
  const { contractApi, weSdk } = globals
  const userSeedsResult = readFileSync(PATH_TO_USER_SEEDS!)
  const parsedUserSeedsResult = JSON.parse(userSeedsResult.toString())
  const userSeed = weSdk.Seed.fromExistingPhrase(parsedUserSeedsResult.seeds[0])
  const mintTxId = await contractApi.mint(userSeed, 4)
  const pollingResult = await runPolling<GetTxStatusResponse>({
    sourceFn: async () => {
      try {
        return await globals.nodeApi.getTxStatus(mintTxId)
      } catch (err) {
        if (err instanceof GetTxStatusError) {
          return err
        }
      }
    },
    predicateFn: (result: GetTxStatusResponse | GetTxStatusError | undefined) => {
      if (result === undefined) {
        return false
      }
      if (result instanceof GetTxStatusError) {
        console.log(`${Date.now()}: ${JSON.stringify(result.response)}`)
        return false
      }
      return result.every(nodeResponse => nodeResponse.status === 'Success')
    },
    pollInterval: 1000,
    timeout: 60000 * 5,
  })
  if (pollingResult instanceof PollingTimeoutError) {
    return
  }
  pollingResult.every(nodeResponse => nodeResponse.status === 'Success')
  console.log(pollingResult)
}

main()
