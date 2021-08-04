import { readFileSync } from "node:fs";
import { ORACLE_CONTRACT_ID, RWA_TOKEN_ID } from "../config";
import { initGlobals } from "../utils";
import { GetTxStatusError, GetTxStatusResponse } from "../utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "../utils/polling";

async function main() {
  const globals = await initGlobals()
  const contractId = await globals.contractApi.createEastContract({
    ...JSON.parse(readFileSync('./east-config.json').toString()),
    oracleContractId: ORACLE_CONTRACT_ID,
    rwaTokenId: RWA_TOKEN_ID,
  });
  const result = await runPolling<GetTxStatusResponse>({
    sourceFn: async () => {
      try {
        return await globals.nodeApi.getTxStatus(contractId)
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
  if (result instanceof PollingTimeoutError) {
    console.log('Timeout error.')
    return
  }
  console.log(result)
}

main();
