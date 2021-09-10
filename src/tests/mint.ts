import { initGlobals } from "./utils";
import { GetTransactionInfoResponse } from "./utils/node-api/get-transaction-info";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "./utils/polling";

async function main() {
  const globals = await initGlobals();
  const { contractApi, oracleContractApi, nodeApi, utils, seed: ownerSeed } = globals
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
   * WEST TRANSFER
   */
  const user1Seed = utils.createRandomSeed()
  const user2Seed = utils.createRandomSeed()
  const transfer1Id = await nodeApi.transfer({
    amount: 4,
    assetId: '',
    recipientAddress: user1Seed.address,
    senderSeed: ownerSeed,
  })
  const transferPollingResult = await runPolling({
    sourceFn: async () => {
      try {
        const result = await nodeApi.getTransactionInfo(transfer1Id)
        return result
      } catch (err) {
        return
      }
    },
    predicateFn: (result: GetTransactionInfoResponse | undefined) => {
      return result !== undefined && result.id !== undefined && result.id === transfer1Id
    },
    pollInterval: 1000,
    timeout: 30000,
  });
  if (transferPollingResult === PollingTimeoutError) {
    console.log('Timeout error');
    return
  }
  console.log('WEST TRANSFER 1')
  console.log(transferPollingResult)  
  const transfer2Id = await nodeApi.transfer({
    amount: 4,
    assetId: '',
    recipientAddress: user2Seed.address,
    senderSeed: ownerSeed,
  })
  const transferPollingResult2 = await runPolling({
    sourceFn: async () => {
      try {
        const result = await nodeApi.getTransactionInfo(transfer2Id)
        return result
      } catch (err) {
        return
      }
    },
    predicateFn: (result: GetTransactionInfoResponse | undefined) => {
      return result !== undefined && result.id !== undefined && result.id === transfer2Id
    },
    pollInterval: 1000,
    timeout: 30000,
  });
  if (transferPollingResult2 === PollingTimeoutError) {
    console.log('Timeout error');
    return
  }
  console.log('WEST TRANSFER 2')
  console.log(transferPollingResult)  
  /**
   * UPDATE ORACLE CONTRACT RATES
   */
  await (async () => {
    const updateRatesTxId = await oracleContractApi.updateRates({
      west: 1,
      rwa: 1,
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
   * MINT 1
   */
  await (async () => {
    const mintTxId = await contractApi.mint(user1Seed, 4)
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
   * EAST TRANSFER
   */
     await (async () => {
      const user2Seed = utils.createRandomSeed()
      const transferTxid = await contractApi.transfer(user1Seed, user2Seed, 1)
      const pollingResult = await runPolling<GetTxStatusResponse>({
        sourceFn: async () => {
          return getTxStatus(transferTxid)
        },
        predicateFn: isContractCallSuccess,
        pollInterval: 1000,
        timeout: 60000 * 5,
      })
      if (pollingResult instanceof PollingTimeoutError) {
        return
      }
      console.log('EAST TRANSFER')
      console.log(pollingResult)
    })();
  /**
   * MINT 2
   */
     await (async () => {
      const mintTxId = await contractApi.mint(user2Seed, 4)
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
  
}

main()
