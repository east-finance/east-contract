import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { MinimumFee, TxId } from "../interfaces";

type UpdateRatesArgs = {
  weSdk: WeSdk
  contractId: TxId,
  minimumFee: MinimumFee,
  userSeed: Seed,
}

export function updateRates(namedArgs: UpdateRatesArgs) {
  const { contractId, minimumFee, userSeed, weSdk } = namedArgs
  const call = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: userSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'supply',
      value: JSON.stringify({
      })
    }],
    atomicBadge: {
      trustedSender: userSeed.address
    }
  });
  call.broadcast(userSeed.keyPair)
  return call.getId(userSeed.keyPair.publicKey)
}
