import nodeFetch from "node-fetch";
import { EAST_SERVICE_ADDRESS } from "../../config";

export type Vault = {
  id: number,
  address: string,
  vaultId: string,
  west_amount: number,
  east_amount: number,
  rwa_amount: number,
  west_rate: number,
  rwa_rate: number,
  rwa_rate_timestamp: Date,
  west_rate_timestamp: Date,
  is_active: boolean,
  created_at: string,
}

export async function getLiquidatableVaults(fetch: typeof nodeFetch): Promise<Vault[]> {
  const data = await fetch(`${EAST_SERVICE_ADDRESS}/v1/user/liquidatableVaults`, {
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
