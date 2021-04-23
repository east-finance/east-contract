import { create, MAINNET_CONFIG } from '@wavesenterprise/js-sdk';
import nodeFetch from 'node-fetch';
import { exec } from 'child_process';
import os from 'os';

const network = os.networkInterfaces();
const local = network?.en0?.filter(({ family }) => family === 'IPv4') ?? [];
const hostIp = local[0].address;

const nodeAddress = 'http://localhost/node-0';
const seedPhrase = 'examples seed phrase';

const fetch = (url: string, options: {}) => {
  const headers = {};
  return nodeFetch(url, { ...options, headers: {...headers, 'x-api-key': 'we', 'Content-Type': 'application/json'} });
};

const execute = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};

const sleep = (timeout: number): Promise<void>=> {
  return new Promise(resolve=> {
    setTimeout(resolve, timeout * 1000);
  });
}

const sendTx = async (tx: any, seed: any) => {
  try {
    const signed = await tx.getSignedTx(seed.keyPair);
    const result = await fetch('http://localhost/node-0/transactions/broadcast', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(signed)
    });
    const resultData = await result.json();
    console.log('result', resultData);
    // console.log(`Tx ${tx.id} (${tx.type}) successfully sent`);
    return resultData
  } catch (err) {
    console.log('Broadcast error:', err);
  }
}

Promise.resolve().then(async () => {
  const imageName = 'east-contract:1.3';
  console.log(`Building docker image ${imageName}, HOST_NETWORK=${hostIp}`);
  await execute(`docker build --build-arg HOST_NETWORK=${hostIp} -t ${imageName} .`);
  console.log('Build image done');

  const inspectResult = await execute(`docker inspect ${imageName}`);
  const inspectData = JSON.parse(inspectResult)[0];
  const imageHash = inspectData.Id.replace('sha256:', '');
  console.log('imageHash', imageHash);

  // @ts-ignore
  const { chainId, minimumFee } = await (await fetch(`${nodeAddress}/node/config`)).json();

  const wavesApiConfig = {
    ...MAINNET_CONFIG,
    nodeAddress,
    crypto: 'waves',
    networkByte: chainId.charCodeAt(0),
    minimumFee
  };

  const Waves = create({
    initialConfiguration: wavesApiConfig,
    fetchInstance: fetch
  });

  const ownerSeed = Waves.Seed.fromExistingPhrase(seedPhrase);

  const txBody = {
    image: imageName,
    imageHash,
    contractName: 'GRPC contract',
    timestamp: Date.now(),
    params: [],
  };

  const tx = Waves.API.Transactions.CreateContract.V2(txBody);
  const tx103 = await sendTx(tx, ownerSeed);

  console.log('Tx 103: ', tx103);
  console.log('Waiting 30 seconds...');
  await sleep(30);

  // @ts-ignore
  const contractId = tx103.id;
  const userSeed = Waves.Seed.fromExistingPhrase('examples seed phrase another one');

  const callTx = {
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [],
  };

  const dockerCallTx = Waves.API.Transactions.CallContract.V2({
    ...callTx,
    params: [{
      type: 'string',
      key: 'mint',
      value: JSON.stringify({
        address: userSeed.address,
        eastAmount: 400,
        westAmount: 500,
        usdpAmount: 200
      })
    }]
  });

  await sendTx(dockerCallTx, ownerSeed);

  console.log('Waiting 10 seconds...');
  await sleep(10);

  const VaultId = await dockerCallTx.getId()
  const transferSeed = Waves.Seed.fromExistingPhrase('examples seed phrase another two');

  await sendTx(Waves.API.Transactions.CallContract.V2({
    ...callTx,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'transfer',
      value: JSON.stringify({
        to: transferSeed.address,
        eastAmount: 100
      })
    }]
  }), userSeed);

  console.log('Waiting 10 seconds...');
  await sleep(10);

  await sendTx(Waves.API.Transactions.CallContract.V2({
    ...callTx,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'mint',
      value: JSON.stringify({
        address: userSeed.address,
        eastAmount: 440,
        westAmount: 540,
        usdpAmount: 250
      })
    }]
  }), ownerSeed);

  console.log('Waiting 10 seconds...');
  await sleep(10);

  await sendTx(Waves.API.Transactions.CallContract.V2({
    ...callTx,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'recalculate_execute',
      value: JSON.stringify({
        eastAmount: 430,
        westAmount: 530,
        usdpAmount: 230,
        vault: VaultId
      })
    }]
  }), ownerSeed);

  console.log('Waiting 10 seconds...');
  await sleep(10);

  await sendTx(Waves.API.Transactions.CallContract.V2({
    ...callTx,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'burn',
      value: JSON.stringify({
        vault: VaultId
      })
    }]
  }), userSeed);
});
