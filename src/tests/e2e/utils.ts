import { exec } from 'child_process';
import nodeFetch from 'node-fetch';
import { TxStatus } from './constants';

export const execute = (command: string): Promise<string> => {
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

export const sleep = (timeout: number): Promise<void>=> {
  return new Promise(resolve => {
    setTimeout(resolve, timeout * 1000);
  });
}

export const fetch = (url: string, options = {}) => {
  const headers = {};
  return nodeFetch(url, { ...options, headers: {...headers, 'x-api-key': 'we', 'Content-Type': 'application/json'} });
};

export async function getTxStatus(nodeAddress: string, txId: string) {
  const data = await fetch(`${nodeAddress}/contracts/status/${txId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (data.status !== 200) {
    throw new Error('Failed to fetch tx status')
  }
  const statuses = await data.json()
  return statuses[0]
}

export async function getContractState(nodeAddress: string, contractId: string) {
  const data = await fetch(`${nodeAddress}/contracts/${contractId}?offset=${0}&limit=${100}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (data.status !== 200) {
    throw new Error('Failed to fetch.')
  }
  return data.json()
}

export interface IContractStateValue {
  type: string;
  key: string;
  value: string;
}

export async function getContractStateKeyValue(nodeAddress: string, contractId: string, key: string): Promise<IContractStateValue> {
  const data = await fetch(`${nodeAddress}/contracts/${contractId}/${key}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (data.status !== 200) {
    throw new Error('getContractStateKeyValue: failed to fetch')
  }
  return data.json()
}

export async function waitForTxStatus(nodeAddress: string, txId: string): Promise<{ status: TxStatus, message: string, txId: string }> {
  let status = null
  for(let i = 0; i < 60 * 10; i++) {
    try {
      status = await getTxStatus(nodeAddress, txId)
      break
    } catch (e) {
      await sleep(0.1)
    }
  }
  if (!status) {
    throw new Error(`Failed to get tx status '${txId}'`)
  }
  return status
}
