import nodeFetch from "node-fetch";
import { NODE_ADDRESS } from "../../config";
import { TxId } from "../interfaces";

export async function getTransactionInfo(fetch: typeof nodeFetch, txId: TxId) {
  const data = await fetch(`${NODE_ADDRESS}/transactions/info/${txId}`, {
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
