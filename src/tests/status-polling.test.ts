import { readFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "./config";
import { TxTypes } from "./constants";
import { initGlobals } from "./utils";
import { runPolling } from "./utils/polling";

async function main() {
  try {
    const { weSdk, contractApi, eastServiceApi } = await initGlobals();
    const result = readFileSync(PATH_TO_USER_SEEDS!)
    const parsedResult = JSON.parse(result.toString())
    const userSeed = weSdk.Seed.fromExistingPhrase(parsedResult.seeds[0])
    const mintTxId = await contractApi.mint(userSeed, 4)
    eastServiceApi.trackTx({
      address: userSeed.address,
      txId: mintTxId,
      type: TxTypes.mint,
    })
    runPolling({
      sourceFn: () => eastServiceApi.getTxStatuses(userSeed.address, 100, 0),
      predicateFn: (result: any) => {
        console.log(result)
        return false
      },
      pollInterval: 1000,
      timeout: 15000,
    })
  } catch (err) {
    console.log(err.message)
  }
}

main()
