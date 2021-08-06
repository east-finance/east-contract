import { readFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "./config";
import { initGlobals } from "./utils";
import { Vault } from "./utils/east-service-api/get-liquidatable-vaults";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "./utils/polling";

async function main() {
  const globals = await initGlobals();
  const { contractApi, weSdk, oracleContractApi, eastServiceApi } = globals
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
   * UPDATE ORACLE CONTRACT RATES
   */
  await (async () => {
    const updateRatesTxId = await oracleContractApi.updateRates({
      key: 'west',
      value: 0.5,
    })
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(updateRatesTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('UPDATE ORACLE CONTRACT RATES')
    console.log(pollingResult)
  })();
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
   * UPDATE ORACLE CONTRACT RATES
   */
  await (async () => {
    const updateRatesTxId = await oracleContractApi.updateRates({
      key: 'west',
      value: 0.1,
    })
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(updateRatesTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('UPDATE ORACLE CONTRACT RATES')
    console.log(pollingResult)
  })();
  /**
   * LIQUIDATE
   */
  await (async () => {
    const liquidatableVaults = await runPolling<Vault[]>({
      sourceFn: eastServiceApi.getLiquidatableVaults,
      predicateFn: (result: Vault[]) => {
        return result.length > 0
      },
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (liquidatableVaults instanceof PollingTimeoutError) {
      return
    }
    const liquidatableVault = liquidatableVaults[0]

    const liquidatorSeed = weSdk.Seed.fromExistingPhrase(parsedUserSeedsResult.seeds[1])
    const liquidateTxId = await contractApi.liquidate(liquidatorSeed, userSeed.address, liquidatableVault.east_amount)
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(liquidateTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('LIQUIDATE')
    console.log(pollingResult)
  })();
}

main()
