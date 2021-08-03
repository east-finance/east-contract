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

export class GetTxStatusError extends Error {
  response: {
    error: number,
    message: string,
  };

  constructor(message: string, response: {
    error: number,
    message: string,
  }) {
    super(message)
    this.response = response
  }
}

export async function getTxStatus(fetch: typeof nodeFetch, txId: string): Promise<GetTxStatusResponse> {
  const data = await fetch(`${NODE_ADDRESS}/contracts/status/${txId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (data.status !== 200) {
    throw new GetTxStatusError('Failed to fetch.', await data.json())
  }
  return data.json()
}
