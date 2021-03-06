import { create, MAINNET_CONFIG, ValidationPolicyType } from '@wavesenterprise/js-sdk';
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
  const imageName = 'east-contract:1.111';
  // const imageHash = 'e8569229b08f9b78f61914d86c423515cf8f1133a665afa0ae443a1a75b5f871'
  console.log(`Building docker image ${imageName}, HOST_NETWORK=${hostIp}`);
  await execute(`docker build --build-arg HOST_NETWORK=${hostIp} -t ${imageName} .`);
  const inspectResult = await execute(`docker inspect ${imageName}`);
  const inspectData = JSON.parse(inspectResult)[0];
  const imageHash = inspectData.Id.replace('sha256:', '');
  console.log('Build image done, image hash: ', imageHash);

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

  const oracleContractId = 'EiuvA4yzBokBXScE3qDzxexj3xqQ4zG9K7Jr6Y6bc7is';
  const rwaTokenId = '5Y4oMP6yvoi1gd64zGymGT93HLUgAxmARL3DHkgKZWAc';
  const servicePublicKey = '6V5hnWRxumRZdRtXhtyhuUWysqyT5TuA5Hs4qmfN323D'
  const serviceAddress = '3NsUWeYmfpyRtb41R7GTm4XgfxLGAVuqJbg'

  const oracleRatesInitialCall = Waves.API.Transactions.CallContract.V4({
    contractId: oracleContractId,
    contractVersion: 1,
    fee: minimumFee[104],
    senderPublicKey: ownerSeed.keyPair.publicKey,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: '000003_latest',
      value: JSON.stringify({ 'value':'1', 'timestamp': Date.now() })
    }, {
      type: 'string',
      key: '000010_latest',
      value: JSON.stringify({ 'value':'0.9978', 'timestamp': Date.now() })
    }]
  });

  await oracleRatesInitialCall.broadcast(ownerSeed.keyPair);
  console.log(`Oracle initial call: ${await oracleRatesInitialCall.getId(ownerSeed.keyPair.publicKey)}`);
  await sleep(15);

  const txBody: Parameters<typeof Waves.API.Transactions.CreateContract.V4>[0] = {
    image: imageName,
    imageHash: imageHash,
    contractName: 'EAST auto-test',
    timestamp: Date.now(),
    params: [
      {
        type: 'string',
        key: 'config',
        value: JSON.stringify({
          oracleContractId,
          oracleTimestampMaxDiff: 1000 * 10000000,
          rwaPart: 0,
          westCollateral: 2.5,
          liquidationCollateral: 1.3,
          minHoldTime: 1000,
          rwaTokenId,
          issueEnabled: true,
          decimals: 8,
          servicePublicKey
        })
      }
    ],
    // validationPolicy: {
    //   type: 'any' as unknown as ValidationPolicyType.majority,
    // },
    // apiVersion: "1.0",
  };

  const tx = Waves.API.Transactions.CreateContract.V3(txBody);
  await tx.broadcast(ownerSeed.keyPair);

  console.log('Create EAST contract id ', await tx.getId(ownerSeed.keyPair.publicKey));
  console.log('Waiting 30 seconds...');
  await sleep(30);

  const contractId = await tx.getId();
  const user1Seed = Waves.Seed.fromExistingPhrase('examples seed phrase another one');

  // Claim overpay init

  // const claimOverpayInit = await Waves.API.Transactions.CallContract.V4({
  //   contractId,
  //   contractVersion: 1,
  //   timestamp: Date.now(),
  //   params: [{
  //     type: 'string',
  //     key: 'claim_overpay_init',
  //     value: '' // JSON.stringify({ maxWestToExchange: 10 })
  //   }]
  // })
  //
  // await claimOverpayInit.broadcast(user1Seed.keyPair);
  //
  // const claimOverpayId = await claimOverpayInit.getId(user1Seed.keyPair.publicKey)
  // console.log('claimOverpayInit id', claimOverpayId)
  // console.log(`claimOverpayInit call: ${JSON.stringify(claimOverpayInit.getBody())}`);
  // console.log('Waiting 15 seconds...');
  // await sleep(15);

  /**
   * User1 - Mint (buy EAST)
   */

  const mintTransfer = Waves.API.Transactions.Transfer.V3({
    recipient: serviceAddress,
    assetId: '',
    amount: 5 * 100000000,
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

  console.log(`Atomic (Transfer + Mint), mint txId: ${await mintCall.getId(user1Seed.keyPair.publicKey)}`);
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
        amount: 1
      })
    }]
  })

  await transferCall.broadcast(user1Seed.keyPair);
  console.log(`Transfer user1 to user2 call id: ${await transferCall.getId(user1Seed.keyPair.publicKey)}`);
  await sleep(15);

  /**
   * Transfer back from User2 to User1
   */

  const transferCall2 = Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'transfer',
      value: JSON.stringify({
        to: user1Seed.address,
        amount: 1
      })
    }]
  })

  await transferCall2.broadcast(user2Seed.keyPair);
  console.log(`Transfer user2 to user1 call id:: ${await transferCall2.getId(user2Seed.keyPair.publicKey)}`);
  await sleep(15);

  /**
   *  User1 supply vault
   */

  const supplyTransfer = Waves.API.Transactions.Transfer.V3({
    recipient: serviceAddress,
    assetId: '',
    amount: 2 * Math.pow(10, 8),
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

  const reissueCall = Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'reissue',
      value: JSON.stringify({ maxWestToExchange: 0.01 * Math.pow(10, 8) })
    }],
    atomicBadge: {
      trustedSender: user1Seed.address
    }
  })

  const supplyAtomic = await Waves.API.Transactions.broadcastAtomic(
    Waves.API.Transactions.Atomic.V1({transactions: [supplyTransfer, supplyCall, reissueCall]}),
    user1Seed.keyPair
  );

  console.log(`Atomic supply call, reissue txId: ${await reissueCall.getId(user1Seed.keyPair.publicKey)}`);
  await sleep(15);

  // Claim overpay init
  const claimOverpayInit = await Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'claim_overpay_init',
      value: '' // JSON.stringify({ amount: 10 })
    }]
  })

  await claimOverpayInit.broadcast(user1Seed.keyPair);

  console.log(`claimOverpayInit call id: ${await claimOverpayInit.getId(user1Seed.keyPair.publicKey)}`);
  // console.log('Waiting 15 seconds...');
  await sleep(1);

  /*
  * Close init
  * */
  const closeInitCall = await Waves.API.Transactions.CallContract.V4({
    contractId,
    contractVersion: 1,
    timestamp: Date.now(),
    params: [{
      type: 'string',
      key: 'close_init',
      value: ''
    }]
  })

  await closeInitCall.broadcast(user1Seed.keyPair);
  console.log(`closeInitCall txId: ${await closeInitCall.getId(user1Seed.keyPair.publicKey)}`)
  console.log('Waiting 15 seconds...');
  await sleep(15);
  //
  // const oracleRatesDumpCall = Waves.API.Transactions.CallContract.V4({
  //   contractId: oracleContractId,
  //   contractVersion: 1,
  //   fee: minimumFee[104],
  //   senderPublicKey: ownerSeed.keyPair.publicKey,
  //   timestamp: Date.now(),
  //   params: [{
  //     type: 'string',
  //     key: '000003_latest',
  //     value: JSON.stringify({ 'value':'0.5', 'timestamp': Date.now() })
  //   }]
  // });
  //
  // await oracleRatesDumpCall.broadcast(ownerSeed.keyPair);
  //
  // console.log(`Oracle dump call: ${JSON.stringify(oracleRatesDumpCall.getBody())}`);
  // console.log('Waiting 20 seconds...');
  // await sleep(20);

  /**
   * User1 - Recalculate
   */

  // const reissueCall = await Waves.API.Transactions.CallContract.V4({
  //   contractId,
  //   contractVersion: 1,
  //   timestamp: Date.now(),
  //   params: [{
  //     type: 'string',
  //     key: 'reissue',
  //     value: '' // JSON.stringify({ maxWestToExchange: 10 })
  //   }]
  // })
  //
  // await reissueCall.broadcast(user1Seed.keyPair);
  //
  // const id = await reissueCall.getId(user1Seed.keyPair.publicKey)
  // console.log('Reissue id', id)
  // console.log(`recalculate call: ${JSON.stringify(reissueCall.getBody())}`);
  // console.log('Waiting 15 seconds...');
  // await sleep(15);


  /**
   * Owner - liquidate first vault
   */

  // const oracleRatesDumpCall = Waves.API.Transactions.CallContract.V4({
  //   contractId: oracleContractId,
  //   contractVersion: 1,
  //   fee: minimumFee[104],
  //   senderPublicKey: ownerSeed.keyPair.publicKey,
  //   timestamp: Date.now(),
  //   params: [{
  //     type: 'string',
  //     key: '000003_latest',
  //     value: JSON.stringify({ 'value':'0.1', 'timestamp': Date.now() })
  //   }]
  // });
  //
  // await oracleRatesDumpCall.broadcast(ownerSeed.keyPair);
  //
  // console.log(`Oracle dump call: ${JSON.stringify(oracleRatesDumpCall.getBody())}`);
  // console.log('Waiting 20 seconds...');
  // await sleep(20);
  //
  // const liquidatorSeed = ownerSeed;
  //
  // const liquidateTransfer = Waves.API.Transactions.Transfer.V3({
  //   recipient: ownerSeed.address,
  //   assetId: rwaTokenId,
  //   amount: 24 * 100000000,
  //   timestamp: Date.now(),
  //   attachment: '',
  //   fee: minimumFee[4],
  //   senderPublicKey: liquidatorSeed.keyPair.publicKey,
  //   atomicBadge: {
  //     trustedSender: liquidatorSeed.address
  //   }
  // });
  //
  // const liquidateCall = Waves.API.Transactions.CallContract.V4({
  //   contractId,
  //   contractVersion: 1,
  //   fee: minimumFee[104],
  //   senderPublicKey: liquidatorSeed.keyPair.publicKey,
  //   timestamp: Date.now(),
  //   params: [{
  //     type: 'string',
  //     key: 'liquidate',
  //     value: JSON.stringify({
  //       transferId: await liquidateTransfer.getId(),
  //       address: user1Seed.address
  //     })
  //   }],
  //   atomicBadge: {
  //     trustedSender: liquidatorSeed.address
  //   }
  // });
  //
  // const liquidateAtomic = await Waves.API.Transactions.broadcastAtomic(
  //   Waves.API.Transactions.Atomic.V1({transactions: [liquidateTransfer, liquidateCall]}),
  //   liquidatorSeed.keyPair
  // );
  //
  // console.log(`Atomic liquidate call: ${JSON.stringify(liquidateAtomic)}`);
  // console.log('Waiting 15 seconds...');
  // await sleep(15);

});
