import { Seed, WeSdk } from "@wavesenterprise/js-sdk";
import { TxId } from "../interfaces";

type LiquidateArgs = {
  weSdk: WeSdk,
  minimumFee: Record<string, number>,
  userSeed: Seed,
  contractId: TxId,
  ownerSeed: Seed,
  rwaTokenId: string,
  rwaAmount: number,
  liquidatableVaultAddress: string,
}

export async function liquidate(namedArgs: LiquidateArgs) {
  const { weSdk, minimumFee, userSeed: liquidatorSeed, ownerSeed, liquidatableVaultAddress, rwaTokenId, contractId, rwaAmount } = namedArgs
  const liquidateTransfer = weSdk.API.Transactions.Transfer.V3({
    recipient: ownerSeed.address,
    assetId: rwaTokenId,
    amount: rwaAmount * 100000000,
    timestamp: Date.now(),
    attachment: '',
    fee: minimumFee[4],
    senderPublicKey: liquidatorSeed.keyPair.publicKey,
    atomicBadge: {
      trustedSender: liquidatorSeed.address
    }
  });

  const liquidateCall = weSdk.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: liquidatorSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'liquidate',
      value: JSON.stringify({
        transferId: await liquidateTransfer.getId(),
        address: liquidatableVaultAddress
      })
    }],
    atomicBadge: {
      trustedSender: liquidatorSeed.address
    }
  });

  weSdk.API.Transactions.broadcastAtomic(
    weSdk.API.Transactions.Atomic.V1({ transactions: [liquidateTransfer, liquidateCall] }),
    liquidatorSeed.keyPair
  );

  return liquidateCall.getId(liquidatorSeed.keyPair.publicKey)
}
