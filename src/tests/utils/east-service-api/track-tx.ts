import nodeFetch from 'node-fetch';
import { EAST_SERVICE_ADDRESS } from '../../config';
import { TxTypes } from '../../constants';

export interface TrackTxRequest {
  txId: string
  address: string
  type: TxTypes,
}

export async function trackTx(fetch: typeof nodeFetch, request: TrackTxRequest) {
  const { status, json } = await fetch(`${EAST_SERVICE_ADDRESS}/transactions/statuses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });
  if (status !== 200) {
    throw new Error('Failed to fetch.')
  }
  return json()
}
