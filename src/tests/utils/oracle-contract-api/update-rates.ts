import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { MinimumFee, TxId } from "../interfaces";

type UpdateRatesArgs = {
  weSdk: WeSdk
  contractId: TxId,
  minimumFee: MinimumFee,
  userSeed: Seed,
  westRate?: number,
  rwaRate?: number,
}

type CallParams = {
  '000003_latest'?: number,
  '000010_latest'?: number,
}

export function updateRates(namedArgs: UpdateRatesArgs) {
  const { contractId, minimumFee, userSeed, weSdk, westRate, rwaRate } = namedArgs
  const callParams: CallParams = {}
  if (westRate !== undefined) {
    callParams['000003_latest'] = westRate
  }
  if (rwaRate !== undefined) {
    callParams['000010_latest'] = rwaRate
  }
  const call = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: userSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'supply',
      value: JSON.stringify(callParams)
    }],
    atomicBadge: {
      trustedSender: userSeed.address
    }
  });
  call.broadcast(userSeed.keyPair)
  return call.getId(userSeed.keyPair.publicKey)
}
