import { initGlobals } from "./utils";
import { GetTransactionInfoResponse } from "./utils/node-api/get-transaction-info";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "./utils/polling";

const WEST_AMOUNT = 15

async function main() {
  const globals = await initGlobals();
  const { contractApi, oracleContractApi, nodeApi, utils, seed: ownerSeed } = globals
  const userSeed = utils.createRandomSeed()
  /**
   * WEST TRANSFER
   */
  const transferId = await nodeApi.transfer({
    amount: WEST_AMOUNT,
    assetId: '',
    recipientAddress: userSeed.address,
    senderSeed: ownerSeed,
  })
  const transferPollingResult = await runPolling({
    sourceFn: async () => {
      try {
        const result = await nodeApi.getTransactionInfo(transferId)
        return result
      } catch (err) {
        return
      }
    },
    predicateFn: (result: GetTransactionInfoResponse | undefined) => {
      return result !== undefined && result.id !== undefined && result.id === transferId
    },
    pollInterval: 1000,
    timeout: 30000,
  });
  if (transferPollingResult === PollingTimeoutError) {
    console.log('Timeout error');
    return
  }
  console.log('WEST TRANSFER');
  console.log(transferPollingResult)
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
      west: 0.5,
      rwa: 0.9978,
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
}

main()
