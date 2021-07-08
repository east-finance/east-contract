import { create, MAINNET_CONFIG } from '@wavesenterprise/js-sdk';
import nodeFetch from 'node-fetch';
import { exec } from 'child_process';
import os from 'os';
import { createContractV4, setAdminForContract } from './create-contract-v4';

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


Promise.resolve().then(async () => {
  const imageName = 'east-contract:1.111';
  // console.log(`Building docker image ${imageName}, HOST_NETWORK=${hostIp}`);
  // await execute(`docker build --build-arg HOST_NETWORK=${hostIp} -t ${imageName} .`);
  // console.log('Build image done');
  
  // const inspectResult = await execute(`docker inspect ${imageName}`);
  // const inspectData = JSON.parse(inspectResult)[0];
  // const imageHash = inspectData.Id.replace('sha256:', '');
  // console.log('imageHash', imageHash);
  
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
  
  /**
  * Create contract
  */
  
  const ownerSeed = Waves.Seed.fromExistingPhrase(seedPhrase);
  
  /*
  const txBody = {
    image: imageName,
    imageHash: 'e8dea5efdf88649ad40aefaaacefb3e32c6afd96b98cfcc80d4f0386ccb526d8',
    contractName: 'GRPC contract',
    timestamp: Date.now(),
    params: [
      {
        type: 'string',
        key: 'config',
        value: JSON.stringify({
          oracleContractId: '4z1Psfwpdp3qTrrFcrEr76Z7MqzR7JbLAvtd9mjfNyGe',
          oracleTimestampMaxDiff: 1000 * 1000000,
          rwaPart:  0.5,
          westCollateral: 2.5,
          liquidationCollateral: 1.3,
          minHoldTime: 1000 * 60 * 60,
          rwaTokenId: 'juLBtauprCVuoYVWLm6a8Fd8C6dwaVSaXa7gTdsZ9gT',
        })
      }
    ],
  };
  
  const tx = Waves.API.Transactions.CreateContract.V2(txBody);
  await tx.broadcast(ownerSeed.keyPair);
  
  console.log('Tx 103: ', tx.getBody());
  console.log('Waiting 30 seconds...');
  await sleep(30);
  */

  const response = await createContractV4(imageName, 'a65670913a8a8cb838728254fd2572eb8f9de056720f74b527bbe458b38b83c7')
  const { id: contractId } = await response.json()
  await sleep(30);
  await setAdminForContract(imageName, 'a65670913a8a8cb838728254fd2572eb8f9de056720f74b527bbe458b38b83c7', contractId)
  await sleep(30);

  /**
  * User1 - Mint (buy EAST)
  */
  const user1Seed = Waves.Seed.fromExistingPhrase('examples seed phrase another one');
  
  const mintTransfer = Waves.API.Transactions.Transfer.V3({
    recipient: ownerSeed.address,
    assetId: '',
    amount: 100 * 100000000,
    timestamp: Date.now(),
    attachment: '',
    fee: minimumFee[4],
    senderPublicKey: user1Seed.keyPair.publicKey,
    atomicBadge: {
      trustedSender: user1Seed.address
    }
  });
  
  const mintCall = Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: user1Seed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'mint',
      value: JSON.stringify({
        transferId: await mintTransfer.getId()
      })
    }],
    atomicBadge: {
      trustedSender: user1Seed.address
    }
  });
  
  const transactions = [mintTransfer, mintCall]
  
  const mint1Atomic = await Waves.API.Transactions.broadcastAtomic(
    Waves.API.Transactions.Atomic.V1({transactions}),
    user1Seed.keyPair
  );
    
  console.log(`Atomic mint call: ${JSON.stringify(mint1Atomic)}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);
    
  /*
  const user2Seed = Waves.Seed.fromExistingPhrase('examples seed phrase another two');
  
  const transferCall = Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),    
    params: [{
      type: 'string',
      key: 'transfer',
      value: JSON.stringify({
        to: user2Seed.address,
        amount: 10
      })
    }]
  })
  
  await transferCall.broadcast(user1Seed.keyPair);
  
  console.log(`transfer call: ${JSON.stringify(transferCall.getBody())}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);
  */
  
  /* 
  const supplyTransfer = Waves.API.Transactions.Transfer.V3({
    recipient: ownerSeed.address,
    assetId: '',
    amount: 50 * 100000000,
    timestamp: Date.now(),
    attachment: '',
    fee: minimumFee[4],
    senderPublicKey: user1Seed.keyPair.publicKey,
    atomicBadge: {
      trustedSender: user1Seed.address
    }
  });
  
  const supplyCall = Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: user1Seed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'supply',
      value: JSON.stringify({
        transferId: await supplyTransfer.getId()
      })
    }],
    atomicBadge: {
      trustedSender: user1Seed.address
    }
  });
  
  const supplyAtomic = await Waves.API.Transactions.broadcastAtomic(
    Waves.API.Transactions.Atomic.V1({transactions: [supplyTransfer, supplyCall]}),
    user1Seed.keyPair
  );
    
  console.log(`Atomic supply call: ${JSON.stringify(supplyAtomic)}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);
  
  const reissueCall = await Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'reissue',
      value: JSON.stringify({ maxWestToExchange: 10 })
    }]
  })
  
  await reissueCall.broadcast(user1Seed.keyPair);
  
  console.log(`recalculate call: ${JSON.stringify(reissueCall.getBody())}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);
    
   const liquidateCall = await Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'liquidate',
      value: JSON.stringify({ address: user1Seed.address})
    }]
  })
  
  await liquidateCall.broadcast(ownerSeed.keyPair);
  
  console.log(`Liquidate call: ${JSON.stringify(liquidateCall.getBody())}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);
  */
});
