import { Seed, ValidationPolicyType, WeSdk } from "@wavesenterprise/js-sdk";
import { IMAGE_HASH, IMAGE_NAME, ORACLE_CONTRACT_ID, RWA_TOKEN_ID } from "../../config";

export async function createEastContract(weSdk: WeSdk, ownerSeed: Seed) {
  const txBody: Parameters<WeSdk['API']['Transactions']['CreateContract']['V4']>[0] = {
    image: IMAGE_NAME,
    imageHash: IMAGE_HASH,
    contractName: 'GRPC contract',
    timestamp: Date.now(),
    params: [
      {
        type: 'string',
        key: 'config',
        value: JSON.stringify({
          oracleContractId: ORACLE_CONTRACT_ID,
          oracleTimestampMaxDiff: 100000000000,
          rwaPart: 0.5,
          westCollateral: 2.5,
          liquidationCollateral: 1.3,
          minHoldTime: 1000 * 60 * 60,
          rwaTokenId: RWA_TOKEN_ID,
        })
      }
    ],
    validationPolicy: {
      type: 'majority' as unknown as ValidationPolicyType.majority,
    },
    apiVersion: "1.0",
  };
  
  const tx = weSdk.API.Transactions.CreateContract.V4(txBody);
  await tx.broadcast(ownerSeed.keyPair);
  return tx.getId(ownerSeed.keyPair.publicKey)
}
