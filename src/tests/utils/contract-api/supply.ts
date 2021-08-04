import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { TxId } from "../interfaces";

type SupplyArgs = {
  weSdk: WeSdk,
  ownerAddress: string,
  minimumFee: Record<string, number>,
  userSeed: Seed,
  westAmount: number,
  contractId: TxId,
}

export async function supply(namedArgs: SupplyArgs) {
  const { weSdk, ownerAddress, userSeed, minimumFee, westAmount, contractId } = namedArgs
  const supplyTransfer = weSdk.API.Transactions.Transfer.V3({
    recipient: ownerAddress,
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
  
  const supplyCall = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: userSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'supply',
      value: JSON.stringify({
        transferId: await supplyTransfer.getId()
      })
    }],
    atomicBadge: {
      trustedSender: userSeed.address
    }
  });
  
  const supplyAtomic = await weSdk.API.Transactions.broadcastAtomic(
    weSdk.API.Transactions.Atomic.V1({transactions: [supplyTransfer, supplyCall]}),
    userSeed.keyPair
  );  
}
