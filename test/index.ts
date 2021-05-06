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
  
  /**
  * Create contract
  */
  
  const ownerSeed = Waves.Seed.fromExistingPhrase(seedPhrase);
  
  const txBody = {
    image: imageName,
    imageHash,
    contractName: 'GRPC contract',
    timestamp: Date.now(),
    params: [
      {
        type: 'string',
        key: 'config',
        value: JSON.stringify({
          oracleContractId: 'some oracle',
          oracleTimestampMaxDiff: 1000 * 10,
          usdpPart:  0.5,
          westCollateral: 2.5,
          liquidationCollateral: 1.3,
          minHoldTime: 1000 * 60 * 60
        })
      }
    ],
  };
  
  const tx = Waves.API.Transactions.CreateContract.V2(txBody);
  await tx.broadcast(ownerSeed.keyPair);
  
  console.log('Tx 103: ', tx.getBody());
  console.log('Waiting 30 seconds...');
  await sleep(30);
  
  /**
  * User1 - Mint (buy EAST)
  */
  
  const contractId = await tx.getId();
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
    
  /**
  * Transfer from User1 to User2
  */
  
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
        eastAmount: 10
      })
    }]
  })
  
  await transferCall.broadcast(user1Seed.keyPair);
  
  console.log(`transfer call: ${JSON.stringify(transferCall.getBody())}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);
  
  /**
  *  User1 supply vault
  */
  
  const vaultId = await mintCall.getId()
  
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
        transferId: await supplyTransfer.getId(),
        vaultId
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
  
  /**
  * User1 - Recalculate
  */
  
  const recalculateCall = await Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'recalculate',
      value: JSON.stringify({ vaultId })
    }]
  })
  
  await recalculateCall.broadcast(user1Seed.keyPair);
  
  console.log(`recalculate call: ${JSON.stringify(recalculateCall.getBody())}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);
  
  /**
  * User1 - Mint 2
  */
  
  const mint2Transfer = Waves.API.Transactions.Transfer.V3({
    recipient: ownerSeed.address,
    assetId: '',
    amount: 150 * 100000000,
    timestamp: Date.now(),
    attachment: '',
    fee: minimumFee[4],
    senderPublicKey: user1Seed.keyPair.publicKey,
    atomicBadge: {
      trustedSender: user1Seed.address
    }
  });
  
  const mint2Call = Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: user1Seed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'mint',
      value: JSON.stringify({
        transferId: await mint2Transfer.getId()
      })
    }],
    atomicBadge: {
      trustedSender: user1Seed.address
    }
  });
  
  
  const mint2Atomic = await Waves.API.Transactions.broadcastAtomic(
    Waves.API.Transactions.Atomic.V1({transactions: [mint2Transfer, mint2Call]}),
    user1Seed.keyPair
  );
  
  const vault2Id = await mint2Call.getId()
  
  console.log(`Atomic mint 2 call: ${JSON.stringify(mint2Atomic)}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);
  
  /**
  * User1 - Burn init for second vault
  */
  
  const burnInitCall = await Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'burn_init',
      value: JSON.stringify({ vaultId: vault2Id })
    }]
  })
  
  await burnInitCall.broadcast(user1Seed.keyPair);
  
  console.log(`Burn init call: ${JSON.stringify(burnInitCall.getBody())}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);

  /**
  * Owner - Burn second vault
  * TODO: make atomic and send transfers back to user
  */
  
   const burnCall = await Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'burn',
      value: JSON.stringify({ vaultId: vault2Id })
    }]
  })
  
  await burnCall.broadcast(ownerSeed.keyPair);
  
  console.log(`Burn call: ${JSON.stringify(burnCall.getBody())}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);

  /**
  * Owner - liquidate first vault
  */
  
   const liquidateCall = await Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'liquidate',
      value: JSON.stringify({ vaultId })
    }]
  })
  
  await liquidateCall.broadcast(ownerSeed.keyPair);
  
  console.log(`Liquidate call: ${JSON.stringify(liquidateCall.getBody())}`);
  console.log('Waiting 15 seconds...');
  await sleep(15);

});
