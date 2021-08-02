import { readFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "./config";
import { TxTypes } from "./constants";
import { initGlobals } from "./utils";
import { PollingTimeoutError, runPolling } from "./utils/polling";

async function main() {
  try {
    const { weSdk, contractApi, eastServiceApi } = await initGlobals();
    const userSeedsResult = readFileSync(PATH_TO_USER_SEEDS!)
    const parsedUserSeedsResult = JSON.parse(userSeedsResult.toString())
    const userSeed = weSdk.Seed.fromExistingPhrase(parsedUserSeedsResult.seeds[0])
    const mintTxId = await contractApi.mint(userSeed, 4)
    await eastServiceApi.trackTx({
      address: userSeed.address,
      txId: mintTxId,
      type: TxTypes.mint,
    })
    const result = await runPolling({
      sourceFn: () => eastServiceApi.getTxStatuses(userSeed.address, 100, 0),
      predicateFn: (result: any) => {
        console.log(result)
        return false
      },
      pollInterval: 1000,
      timeout: 15000,
    })
    if (result instanceof PollingTimeoutError) {
      console.log('Timeout error')
    }
  } catch (err) {
    console.log(err.message)
  }
}

main()
