import nodeFetch from "node-fetch";
import { NODE_ADDRESS } from "../../config";

export type GetTxStatusResponse = {
  sender: string,
  senderPublicKey: string,
  txId: string,
  status: string, // Success
  code: null,
  message: string,
  timestamp: number,
  signature: string,
}[]

export async function getTxStatus(fetch: typeof nodeFetch, txId: string): Promise<GetTxStatusResponse> {
  const data = await fetch(`${NODE_ADDRESS}/contracts/status/${txId}`, {
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
