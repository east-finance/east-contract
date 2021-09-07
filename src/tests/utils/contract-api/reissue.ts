import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { TxId } from "../interfaces";

type ReissueArgs = {
  weSdk: WeSdk,
  minimumFee: Record<string, number>,
  userSeed: Seed,
  contractId: TxId,
  maxWestToExchange?: number,
}

export async function reissue(namedArgs: ReissueArgs) {
  const { weSdk, userSeed, minimumFee, contractId, maxWestToExchange } = namedArgs
  const reissueCall = await weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    fee: minimumFee[104],
    params: [{
      type: 'string',
      key: 'reissue',
      value: maxWestToExchange ? JSON.stringify({ maxWestToExchange: maxWestToExchange * Math.pow(10, 8) }) : ''
    }]
  })
  reissueCall.broadcast(userSeed.keyPair);
  return reissueCall.getId(userSeed.keyPair.publicKey)
}
