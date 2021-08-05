import { initGlobals } from "../utils";
import { GetTxStatusError, GetTxStatusResponse } from "../utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "../utils/polling";

async function main(west?: number, rwa?: number) {
  const { oracleContractApi, nodeApi } = await initGlobals()
  const txIds = []
  if (west !== undefined) {
    txIds.push(await oracleContractApi.updateRates({ key: 'west', value: west }))
  }
  if (rwa !== undefined) {
    txIds.push(await oracleContractApi.updateRates({ key: 'rwa', value: rwa }))
  }
  const pollingPromises: Promise<GetTxStatusResponse | PollingTimeoutError>[] = []
  txIds.forEach(txId => {
    pollingPromises.push(
      runPolling<GetTxStatusResponse>({
        sourceFn: async () => {
          try {
            return await nodeApi.getTxStatus(txId)
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
            return false
          }
          return result.every(nodeResponse => nodeResponse.status === 'Success')
        },
        pollInterval: 1000,
        timeout: 60000,
      })
    )
  })
  console.log(await Promise.all(pollingPromises))
}

const west: number | undefined = process.env.WEST === undefined ? undefined : parseFloat(process.env.WEST)

const rwa: number | undefined = process.env.RWA === undefined ? undefined : parseFloat(process.env.RWA)

main(west, rwa)
