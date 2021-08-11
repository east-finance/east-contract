import { initGlobals } from "./utils";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";

async function main() {
  const { contractApi, nodeApi } = await initGlobals();
  const getTxStatus = async (txId: string) => {
    try {
      return await nodeApi.getTxStatus(txId)
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
   * UPDATE CONFIG
   */
  (async () => {
    const updateConfigTxId = contractApi
  })()
}

main()