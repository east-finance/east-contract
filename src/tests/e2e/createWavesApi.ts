import { create, MAINNET_CONFIG, ValidationPolicyType } from '@wavesenterprise/js-sdk';
import { nodeAddress } from './constants'
import { fetch } from './utils'

export const createWavesApi = async () => {
  const { chainId, minimumFee } = await (await fetch(`${nodeAddress}/node/config`)).json();
  const wavesApiConfig = {
    ...MAINNET_CONFIG,
    nodeAddress,
    crypto: 'waves',
    networkByte: chainId.charCodeAt(0),
    minimumFee
  };
  const WavesApi = create({
    initialConfiguration: wavesApiConfig,
    fetchInstance: fetch
  });
  return WavesApi
}
