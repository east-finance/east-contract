import { initGlobals } from "../utils";
import { GetTxStatusError, GetTxStatusResponse } from "../utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "../utils/polling";

async function main(west?: number, rwa?: number) {
  const { oracleContractApi, nodeApi } = await initGlobals()
  const txId = await oracleContractApi.updateRates({ west, rwa })
  const pollintResult = await runPolling<GetTxStatusResponse>({
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
  if (pollintResult instanceof PollingTimeoutError) {
    console.log('Timeout error');
    return
  }
  console.log(pollintResult)
}

const west: number | undefined = process.env.WEST === undefined ? undefined : parseFloat(process.env.WEST)

const rwa: number | undefined = process.env.RWA === undefined ? undefined : parseFloat(process.env.RWA)

main(west, rwa)
