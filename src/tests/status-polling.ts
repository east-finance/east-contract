import { TxTypes } from "./constants";
import { initGlobals } from "./utils";
import { GetTransactionInfoResponse } from "./utils/node-api/get-transaction-info";
import { PollingTimeoutError, runPolling } from "./utils/polling";

const WEST_AMOUNT = 5

async function main() {
  try {
    const { contractApi, eastServiceApi, nodeApi, utils, seed: ownerSeed } = await initGlobals();

    /**
     * UPDATE RATES
     */
    
    
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

    /**
     * MINT
     */
    const mintTxId = await contractApi.mint(userSeed, WEST_AMOUNT)
    await eastServiceApi.trackTx({
      address: userSeed.address,
      txId: mintTxId,
      type: TxTypes.mint,
    })
    const result = await runPolling({
      sourceFn: () => eastServiceApi.getTxStatuses(userSeed.address, 100, 0),
      predicateFn: (result: any) => {
        console.log(result)
        return false
      },
      pollInterval: 1000,
      timeout: 1000 * 120,
    })
    if (result instanceof PollingTimeoutError) {
      console.log('Timeout error')
      return
    }
  } catch (err) {
    console.log(err.message)
  }
}

main()
