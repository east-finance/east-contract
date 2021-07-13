// TODO: temporary utility file
import nodeFetch from 'node-fetch'

const NODE_ADDRESS = 'http://localhost/node-0'

function fetch(url: RequestInfo, options?: RequestInit): Promise<Response> {
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

async function getConfig() {
  return (await fetch(`${NODE_ADDRESS}/node/config`)).json()
}

export async function createContractV4(imageName: string, imageHash: string) {
  const { minimumFee } = await getConfig();
  return fetch(`${NODE_ADDRESS}/transactions/signAndBroadcast`, {
    method: 'POST',
    body: JSON.stringify({
      "image": imageName,
      "imageHash": imageHash,
      "contractName": "GRPC contract",
      "timestamp": Date.now(),
      "validationPolicy": {
        "type": "majority"
      },
      "params": [
        {
          "type": "string",
          "key": "config",
          "value": JSON.stringify({
            "oracleContractId": "4z1Psfwpdp3qTrrFcrEr76Z7MqzR7JbLAvtd9mjfNyGe",
            "rwaTokenId": "juLBtauprCVuoYVWLm6a8Fd8C6dwaVSaXa7gTdsZ9gT",
            "oracleTimestampMaxDiff": 1000000000,
            "rwaPart": 0.5,
            "westCollateral": 2.5,
            "liquidationCollateral": 1.3,
            "minHoldTime": 1,
          })
        }
      ],
      "version": 4,
      "apiVersion": "1.0",
      "feeAssetId": null,
      "type": 103,
      "fee": minimumFee[103],
      "sender": "3NzTm3wRboS8Lhi6oKzGLeFiTWMp1w3mPvS",
      "password": "qyVXdxSjYId99xBbrTE_wA"
    })
  })
}

export async function setAdminForContract(imageName: string, imageHash: string, contractId: string) {
  return fetch(`${NODE_ADDRESS}/transactions/signAndBroadcast`, {
    method: 'POST',
    body: JSON.stringify({
      "image": imageName,
      "imageHash": imageHash,
      "contractName": "GRPC contract",
      "timestamp": Date.now(),
      "params": [
        {
          "type": "string",
          "key": "update_config",
          "value": JSON.stringify({
            "issueEnabled": true,
            "oracleContractId": "4z1Psfwpdp3qTrrFcrEr76Z7MqzR7JbLAvtd9mjfNyGe",
            "oracleTimestampMaxDiff": 1000000000,
            "rwaPart": 0.5,
            "westCollateral": 2.5,
            "liquidationCollateral": 1.3,
            "minHoldTime": 1,
            "rwaTokenId": "juLBtauprCVuoYVWLm6a8Fd8C6dwaVSaXa7gTdsZ9gT",
            "adminAddress": "3Ny3vjNsoNyX6afHdv7byVNHoMV7CYSHkUz",
            "adminPublicKey": "HsvBdAYfUATNdw3LKkzgQmJgpeivqnKzTs7vReVPyAKP",
          })
        }
      ],
      "version": 4,
      "apiVersion": "1.0",
      "feeAssetId": null,
      "type": 104,
      "fee": 0,
      "sender": "3NzTm3wRboS8Lhi6oKzGLeFiTWMp1w3mPvS",
      "password": "qyVXdxSjYId99xBbrTE_wA",
      "contractVersion": 1,
      "contractId": contractId,
    })
  })
}
