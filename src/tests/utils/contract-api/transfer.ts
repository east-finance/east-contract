import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { TxId } from "../interfaces";

type TransferArgs = {
  weSdk: WeSdk,
  minimumFee: Record<string, number>,
  userFromSeed: Seed,
  userToSeed: Seed,
  amount: number,
  contractId: TxId,
}

export async function transfer(namedArgs: TransferArgs) {
  const { weSdk, amount, contractId, minimumFee, userFromSeed, userToSeed } = namedArgs;
  const transferCall = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: userFromSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'transfer',
      value: JSON.stringify({
        to: userToSeed.address,
        amount: amount * Math.pow(10, 8),
      })
    }],
  });
  transferCall.broadcast(userFromSeed.keyPair)
  return transferCall.getId(userFromSeed.keyPair.publicKey)
}
