import { TxTypes } from "./constants";
import { initGlobals } from "./utils";
import { GetTxStatusesResponse } from "./utils/east-service-api/get-tx-statuses";
import { GetTransactionInfoResponse } from "./utils/node-api/get-transaction-info";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "./utils/polling";

const WEST_AMOUNT = 5

async function main() {
  try {
    const { contractApi, eastServiceApi, nodeApi, utils, seed: ownerSeed, oracleContractApi } = await initGlobals();
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
     * UPDATE RATES
     */
    const updateRatesTxId = await oracleContractApi.updateRates({
      west: 0.5,
      rwa: 0.9978,
    })
    const updateRatesResult = await runPolling({
      sourceFn: () => {
        return getTxStatus(updateRatesTxId)
      },
      predicateFn: isContractCallSuccess,
      pollInterval: 1000,
      timeout: 30000,
    })
    if (updateRatesResult instanceof PollingTimeoutError) {
      console.log('Update rates. Timeout error.')
      return
    }
    console.log('UPDATE RATES')
    console.log(updateRatesResult)
    
    const userSeed = utils.createRandomSeed()
    /**
     * TRANSFER
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
    console.log('TRANSFER')
    console.log(transferPollingResult)

    /**
     * MINT
     */
    const mintTxId = await contractApi.mint(userSeed, WEST_AMOUNT)
    await eastServiceApi.trackTx({
      address: userSeed.address,
      txId: mintTxId,
      type: TxTypes.mint,
      timestamp: Date.now(),
    })
    const result = await runPolling({
      sourceFn: () => eastServiceApi.getTxStatuses(userSeed.address, 100, 0),
      predicateFn: (result: GetTxStatusesResponse) => {
        const txStatus = result.find(tx => tx.tx_id === mintTxId)
        return txStatus !== undefined && txStatus.status === 'success'
      },
      pollInterval: 1000,
      timeout: 1000 * 120,
    })
    if (result instanceof PollingTimeoutError) {
      console.log('Timeout error')
      return
    }
    console.log('MINT')
    console.log(result)
  } catch (err) {
    console.log(err.message)
  }
}

main()
