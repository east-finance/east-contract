import { readFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "./config";
import { initGlobals } from "./utils";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "./utils/polling";

async function main() {
  const globals = await initGlobals();
  const { contractApi, weSdk, oracleContractApi } = globals
  const userSeedsResult = readFileSync(PATH_TO_USER_SEEDS!)
  const parsedUserSeedsResult = JSON.parse(userSeedsResult.toString())
  const userSeed = weSdk.Seed.fromExistingPhrase(parsedUserSeedsResult.seeds[0]);
  const getTxStatus = async (txId: string) => {
    try {
      return await globals.nodeApi.getTxStatus(txId)
    } catch (err) {
      if (err instanceof GetTxStatusError) {
        return err
      }
    }
  }
  const isContractCallSuccess = (result: GetTxStatusResponse | GetTxStatusError | undefined) => {
    if (result === undefined) {
      return false
    }
    if (result instanceof GetTxStatusError) {
      console.log(`${Date.now()}: ${JSON.stringify(result.response)}`)
      return false
    }
    return result.every(nodeResponse => nodeResponse.status === 'Success')
  }
  /**
   * MINT
   */
  await (async () => {
    const mintTxId = await contractApi.mint(userSeed, 5)
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(mintTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('MINT')
    console.log(pollingResult)
  })();
  /**
   * SUPPLY
   */
  await (async () => {
    const supplyTxId = await contractApi.supply(userSeed, 10)
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(supplyTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('SUPPLY')
    console.log(pollingResult)
  })();
  /** 
   * REISSUE
   */
  await (async () => {
    const reissueTxId = await contractApi.reissue(userSeed)
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(reissueTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('REISSUE')
    console.log(pollingResult)
  })();
  /**
   * UPDATE ORACLE RATE
   */
  await (async () => {
    const updateRateId = await oracleContractApi.updateRates({
      key: 'west',
      value: 0.6
    })
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(updateRateId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('UPDATE ORACLE RATE')
    console.log(pollingResult)
  })()
  /**
   * CLAIM OVERPAY INIT
   */
  await (async () => {

  })();
}

main()
