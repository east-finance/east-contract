import { IKeyPair, WeSdk } from "@wavesenterprise/js-sdk";
import { MinimumFee } from "../interfaces";

export type TransferArgs = {
  weSdk: WeSdk,
  minimumFee: MinimumFee
  assetId: string,
  senderKeyPair: IKeyPair,
  recipientAddress: string,
  amount: number,
}

export async function transfer(namedArgs: TransferArgs) {
  const { weSdk, recipientAddress, minimumFee, senderKeyPair, amount } = namedArgs;
  const transferCall = weSdk.API.Transactions.Transfer.V3({
    recipient: recipientAddress,
    assetId: '',
    amount: amount * 100000000,
    timestamp: Date.now(),
    attachment: '',
    fee: minimumFee[4],
    senderPublicKey: senderKeyPair.publicKey,
  });
  transferCall.broadcast(senderKeyPair)
  return transferCall.getId(senderKeyPair.publicKey)
}
