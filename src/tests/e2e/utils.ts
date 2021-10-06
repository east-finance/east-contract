import { exec } from 'child_process';
import nodeFetch from 'node-fetch';

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
  return new Promise(resolve=> {
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
