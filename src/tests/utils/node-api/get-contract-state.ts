import nodeFetch from "node-fetch";
import { NODE_ADDRESS } from "../../config";
import { TxId } from "../interfaces";

export async function getContractState(fetch: typeof nodeFetch, contractId: TxId, limit: number, offset: number = 0) {
  const data = await fetch(`${NODE_ADDRESS}/v1/contracts/${contractId}?offset=${offset}&limit=${limit}`, {
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
