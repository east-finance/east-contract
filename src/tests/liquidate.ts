import { NODE_ADDRESS, RWA_TOKEN_ID } from "./config";
import { initGlobals } from "./utils";
import { Vault } from "./utils/east-service-api/get-liquidatable-vaults";
import { GetTxStatusError, GetTxStatusResponse } from "./utils/node-api/get-tx-status";
import { PollingTimeoutError, runPolling } from "./utils/polling";

function generateWord(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

function generateUserSeedPhrase() {
  let result = ''
  for (let i = 0; i < 5; i++) {
    result = result + generateWord(5) + ' '
  }
  return result.slice(0, -1)
}

const WEST_AMOUNT = 5

const RWA_AMOUNT = 2

async function main() {
  const globals = await initGlobals();
  const { contractApi, weSdk, oracleContractApi, eastServiceApi, seed: ownerSeed, minimumFee, fetch } = globals

  const userSeedPhrase = generateUserSeedPhrase()
  const userSeed = weSdk.Seed.fromExistingPhrase(userSeedPhrase)
  const westTransferCall = weSdk.API.Transactions.Transfer.V3({
    recipient: userSeed.address,
    assetId: '',
    amount: WEST_AMOUNT * 100000000,
    timestamp: Date.now(),
    attachment: '',
    fee: minimumFee[4],
    senderPublicKey: ownerSeed.keyPair.publicKey,
  });
  westTransferCall.broadcast(ownerSeed.keyPair)
  const westTransferTxId = await westTransferCall.getId(ownerSeed.keyPair.publicKey)
  await runPolling({
    sourceFn: async () => {
      const data = await fetch(`${NODE_ADDRESS}/transactions/info/${westTransferTxId}`)
      return data.json()
    },
    predicateFn: (result: any) => {
      console.log('waiting for west transfer to user')
      return result.id !== undefined && result.id === westTransferTxId
    },
    pollInterval: 1000,
    timeout: 30000,
  })
  
  const liquidatorSeedPhrase = generateUserSeedPhrase()
  const liquidator = weSdk.Seed.fromExistingPhrase(liquidatorSeedPhrase)
  const rwaTransferCall = weSdk.API.Transactions.Transfer.V3({
    recipient: liquidator.address,
    assetId: RWA_TOKEN_ID,
    amount: RWA_AMOUNT * 100000000,
    timestamp: Date.now(),
    attachment: '',
    fee: minimumFee[4],
    senderPublicKey: ownerSeed.keyPair.publicKey,
  });
  rwaTransferCall.broadcast(ownerSeed.keyPair)
  const rwaTransferTxId = await westTransferCall.getId(ownerSeed.keyPair.publicKey)
  await runPolling({
    sourceFn: async () => {
      const data = await fetch(`${NODE_ADDRESS}/transactions/info/${rwaTransferTxId}`)
      return data.json()
    },
    predicateFn: (result: any) => {
      console.log('waiting for rwa transfer to liquidator')
      return result.id !== undefined && result.id === rwaTransferTxId
    },
    pollInterval: 1000,
    timeout: 30000,
  })  
  
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
    const mintTxId = await contractApi.mint(userSeed, WEST_AMOUNT)
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
        const vault = result.find(vault => vault.address === userSeed.address)
        return vault !== undefined
      },
      pollInterval: 1000,
      timeout: 60000 * 5,
    })
    if (liquidatableVaults instanceof PollingTimeoutError) {
      return
    }
    const liquidatableVault = liquidatableVaults.find(vault => vault.address === userSeed.address)!
    const liquidateTxId = await contractApi.liquidate(
      liquidator,
      liquidatableVault.address,
      parseFloat(liquidatableVault.east_amount as unknown as string)
    );
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
