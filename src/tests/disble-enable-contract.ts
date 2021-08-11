import { readFileSync } from "fs";
import { NODE_ADDRESS, ORACLE_CONTRACT_ID, RWA_TOKEN_ID } from "./config";
import { initGlobals } from "./utils";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "./utils/polling";

async function main() {
  const { contractApi, nodeApi, utils, seed: ownerSeed, fetch } = await initGlobals();
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
  const userSeed = utils.createRandomSeed();
  const transferId = await nodeApi.transfer({
    amount: 5,
    assetId: '',
    recipientAddress: userSeed.address,
    senderSeed: ownerSeed,
  });
  await runPolling({
    sourceFn: async () => {
      try {
        const result = await nodeApi.getTransactionInfo(transferId)
        return result
      } catch (err) {
        return
      }
    },
    predicateFn: (result: any) => {
      console.log('waiting for west transfer to user')
      return result !== undefined && result.id !== undefined && result.id === transferId
    },
    pollInterval: 1000,
    timeout: 30000,
  });
  /**
   * DISABLE CONTRACT
   */
  await (async () => {
    const updateConfigTxId = await contractApi.updateConfig({
      ...JSON.parse(readFileSync('./east-config.json').toString()),
      oracleContractId: ORACLE_CONTRACT_ID,
      rwaTokenId: RWA_TOKEN_ID,
      isContractEnabled: false,
    })
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(updateConfigTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('DISABLE CONTRACT')
    console.log(pollingResult)
  })();
  /**
   * ENABLE CONTRACT
   */
   await (async () => {
    const updateConfigTxId = await contractApi.updateConfig({
      ...JSON.parse(readFileSync('./east-config.json').toString()),
      oracleContractId: ORACLE_CONTRACT_ID,
      rwaTokenId: RWA_TOKEN_ID,
      isContractEnabled: true,
    })
    const pollingResult = await runPolling<GetTxStatusResponse>({
      sourceFn: async () => {
        return getTxStatus(updateConfigTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (pollingResult instanceof PollingTimeoutError) {
      return
    }
    console.log('ENABLE CONTRACT')
    console.log(pollingResult)
  })();
}

main()
