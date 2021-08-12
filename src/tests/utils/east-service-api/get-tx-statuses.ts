import nodeFetch from 'node-fetch'
import { EAST_SERVICE_ADDRESS } from '../../config';
import { TxTypes } from '../../constants';

export type GetTxStatusesResponse = {
  id: number,
  tx_id: string,
  address: string,
  status: 'success' | 'fail' | 'pending',
  type: TxTypes,
  error: string | null;
}[];

export async function getTxStatuses(fetch: typeof nodeFetch, address: string, limit: number, offset: number): Promise<GetTxStatusesResponse> {
  const data = await fetch(`${EAST_SERVICE_ADDRESS}/v1/user/transactions/statuses?address=${address}&limit=${limit}`, {
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
