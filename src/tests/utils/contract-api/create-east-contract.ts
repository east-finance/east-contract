import { Seed, ValidationPolicyType, WeSdk } from "@wavesenterprise/js-sdk";
import { ConfigParam } from "../../../interfaces";
import { IMAGE_HASH, IMAGE_NAME } from "../../config";

export async function createEastContract(weSdk: WeSdk, ownerSeed: Seed, config: ConfigParam) {
  const txBody: Parameters<WeSdk['API']['Transactions']['CreateContract']['V4']>[0] = {
    image: IMAGE_NAME,
    imageHash: IMAGE_HASH,
    contractName: 'EAST contract',
    timestamp: Date.now(),
    params: [
      {
        type: 'string',
        key: 'config',
        value: JSON.stringify(config)
      }
    ],
    validationPolicy: {
      type: 'majority' as unknown as ValidationPolicyType.majority,
    },
    apiVersion: "1.0",
  };
  
  const tx = weSdk.API.Transactions.CreateContract.V4(txBody);
  tx.broadcast(ownerSeed.keyPair);
  return tx.getId(ownerSeed.keyPair.publicKey)
}
