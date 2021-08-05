import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { MinimumFee, TxId } from "../interfaces";

type UpdateRatesArgs = {
  weSdk: WeSdk
  contractId: TxId,
  minimumFee: MinimumFee,
  userSeed: Seed,
  key: 'west' | 'rwa',
  value: number,
}

export function updateRates(namedArgs: UpdateRatesArgs) {
  const { contractId, minimumFee, userSeed, weSdk, key, value } = namedArgs
  let realKey: '000003_latest' | '000010_latest' | undefined
  if (key === 'west') {
    realKey = '000003_latest'
  }
  if (key === 'rwa') {
    realKey = '000010_latest'
  }
  const call = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: userSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: realKey,
      value: JSON.stringify({ timestamp: Date.now(), value: value.toString() }),
    }],
  });
  call.broadcast(userSeed.keyPair)
  return call.getId(userSeed.keyPair.publicKey)
}
