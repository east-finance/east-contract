import nodeFetch from 'node-fetch'
import { EAST_SERVICE_ADDRESS } from '../../config';

export async function getTxStatuses(fetch: typeof nodeFetch, address: string, limit: number, offset: number) {
  const { status, json } = await fetch(`${EAST_SERVICE_ADDRESS}/v1/user/transactions/statuses?address=${address}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (status !== 200) {
    throw new Error('Failed to fetch.')
  }
  return json()
}
