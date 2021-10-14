import { WeSdk, Seed } from '@wavesenterprise/js-sdk';
import { imageName, oracleContractId, rwaTokenId, serviceSeedPhrase, adminSeedPhrase } from './constants'

export const createEAST = async (wavesApi: WeSdk, imageHash: string) => {
  const adminSeed = wavesApi.Seed.fromExistingPhrase(adminSeedPhrase);
  const serviceSeed = wavesApi.Seed.fromExistingPhrase(serviceSeedPhrase);
  const txBody: Parameters<typeof wavesApi.API.Transactions.CreateContract.V4>[0] = {
    image: imageName,
    imageHash: imageHash,
    contractName: 'EAST e2e test',
    timestamp: Date.now(),
    params: [
      {
        type: 'string',
        key: 'config',
        value: JSON.stringify({
          oracleContractId,
          oracleTimestampMaxDiff: 1000 * 60 * 10,
          rwaPart: 0,
          westCollateral: 2.5,
          liquidationCollateral: 1.3,
          minHoldTime: 1000,
          rwaTokenId,
          issueEnabled: true,
          decimals: 8,
          servicePublicKey: serviceSeed.keyPair.publicKey
        })
      }
    ],
    // validationPolicy: {
    //   type: 'any' as unknown as ValidationPolicyType.majority,
    // },
    // apiVersion: "1.0",
  };

  const tx = wavesApi.API.Transactions.CreateContract.V3(txBody)
  await tx.broadcast(adminSeed.keyPair);

  const id = await tx.getId(adminSeed.keyPair.publicKey)
  return id
}
