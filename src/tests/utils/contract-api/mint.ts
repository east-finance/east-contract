import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { TxId, MinimumFee } from "../interfaces";

export type MintArgs = {
  weSdk: WeSdk,
  ownerSeed: Seed,
  userSeed: Seed,
  minimumFee: MinimumFee,
  contractId: TxId,
  westAmount: number,
}

export async function mint(namedArgs: MintArgs) {
  const { weSdk, ownerSeed, userSeed, minimumFee, contractId, westAmount } = namedArgs;
  const mintTransfer = weSdk.API.Transactions.Transfer.V3({
    recipient: ownerSeed.address,
    assetId: '',
    amount: westAmount * 100000000,
    timestamp: Date.now(),
    attachment: '',
    fee: minimumFee[4],
    senderPublicKey: userSeed.keyPair.publicKey,
    atomicBadge: {
      trustedSender: userSeed.address
    }
  });

  const mintCall = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: userSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'mint',
      value: JSON.stringify({
        transferId: await mintTransfer.getId()
      })
    }],
    atomicBadge: {
      trustedSender: userSeed.address
    }
  });

  const transactions = [mintTransfer, mintCall]

  const mint1Atomic = await weSdk.API.Transactions.broadcastAtomic(
    weSdk.API.Transactions.Atomic.V1({ transactions }),
    userSeed.keyPair
  );

  return mintCall.getId(userSeed.keyPair.publicKey)
}
