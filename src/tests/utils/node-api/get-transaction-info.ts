import nodeFetch from "node-fetch";
import { NODE_ADDRESS } from "../../config";
import { TxId } from "../interfaces";

export type GetTransactionInfoResponse = {
  senderPublicKey: string,
  fee: number,
  type: number,
  version: number,
  atomicBadge: any,
  attachment: string,
  sender: string,
  feeAssetId: string | null,
  proofs: string[],
  assetId: string | null,
  recipient: string,
  id: string,
  timestamp: number,
  height: number,
}

export async function getTransactionInfo(fetch: typeof nodeFetch, txId: TxId): Promise<GetTransactionInfoResponse> {
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
