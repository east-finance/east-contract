import { create, MAINNET_CONFIG, WeSdk } from '@wavesenterprise/js-sdk';
import nodeFetch from 'node-fetch';

interface Globals {
  fetch?: typeof fetch,
  nodeAddress?: string,
  seedPhrase?: string,
  weSdk?: WeSdk,
}

const globals: Globals = {
  fetch: undefined,
  nodeAddress: undefined,
  seedPhrase: undefined,
  weSdk: undefined,
}

beforeAll(async () => {
  globals.fetch = (url: RequestInfo, options?: RequestInit): Promise<Response> => {
    // @ts-ignore
    return nodeFetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'x-api-key': 'we',
        'Content-Type': 'application/json',
      },
    });
  }

  globals.nodeAddress = 'http://localhost/node-0';
  globals.seedPhrase = 'examples seed phrase';

  const { chainId, minimumFee } = await(await globals.fetch(`${globals.nodeAddress}/node/config`)).json()

  const wavesApiConfig = {
    ...MAINNET_CONFIG,
    nodeAddress: globals.nodeAddress,
    crypto: 'waves',
    networkByte: chainId.charCodeAt(0),
    minimumFee
  };

  globals.weSdk = create({
    initialConfiguration: wavesApiConfig,
    fetchInstance: globals.fetch,
  });
})

test('example', async () => {
  console.log(globals.weSdk)
})
