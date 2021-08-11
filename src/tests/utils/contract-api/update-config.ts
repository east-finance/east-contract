import { Seed, WeSdk } from "@wavesenterprise/js-sdk"
import { ConfigParam } from "../../../interfaces";
import { MinimumFee, TxId } from "../interfaces"

export type UpdateConfigArgs = {
  weSdk: WeSdk,
  ownerSeed: Seed,
  minimumFee: MinimumFee,
  contractId: TxId,
  config: ConfigParam,
}

export async function updateConfig(namedArgs: UpdateConfigArgs) {
  const { weSdk, ownerSeed, minimumFee, contractId, config } = namedArgs;
  const call = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: ownerSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'update_config',
      value: JSON.stringify(config)
    }],
  });
  call.broadcast(ownerSeed.keyPair)
  return call.getId(ownerSeed.keyPair.publicKey)
}
