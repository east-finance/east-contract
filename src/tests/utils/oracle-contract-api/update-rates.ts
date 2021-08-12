import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { MinimumFee, TxId } from "../interfaces";

type UpdateRatesArgs = {
  weSdk: WeSdk
  contractId: TxId,
  minimumFee: MinimumFee,
  userSeed: Seed,
  west?: number,
  rwa?: number,
}

export function updateRates(namedArgs: UpdateRatesArgs) {
  const { contractId, minimumFee, userSeed, weSdk, west, rwa } = namedArgs
  const westKey = '000003_latest';
  const rwaKey = '000010_latest';
  const params = [];
  if (west !== undefined) {
    params.push(
      {
        type: 'string',
        key: westKey,
        value: JSON.stringify({ timestamp: Date.now(), value: west.toString() }),
      }
    )
  }
  if (rwa !== undefined) {
    params.push(
      {
        type: 'string',
        key: rwaKey,
        value: JSON.stringify({ timestamp: Date.now(), value: rwa.toString() }),
      }
    )
  }
  const call = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: userSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params,
  });
  call.broadcast(userSeed.keyPair)
  return call.getId(userSeed.keyPair.publicKey)
}
