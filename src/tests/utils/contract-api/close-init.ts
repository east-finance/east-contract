import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { TxId } from "../interfaces";

type CloseInitArgs = {
  weSdk: WeSdk,
  minimumFee: Record<string, number>,
  userSeed: Seed,
  contractId: TxId,
}

export async function closeInit(namedArgs: CloseInitArgs) {
  const { weSdk, userSeed, minimumFee, contractId } = namedArgs
  const closeInit = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: userSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'close_init',
      value: ''
    }],
  });
  closeInit.broadcast(userSeed.keyPair)
  return closeInit.getId(userSeed.keyPair.publicKey)
}
