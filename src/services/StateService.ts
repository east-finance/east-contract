import { Metadata } from '@grpc/grpc-js';
import { DataEntryResponse } from '../interfaces';

export class StateService {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  getContractKey(auth: Metadata, contractId: string, key: string): Promise<{ entry: DataEntryResponse }> {
    return new Promise((resolve, reject) => {
      this.client.getContractKey({
        contract_id: contractId,
        key,
      }, auth, function (error: Error, response: { entry: DataEntryResponse }) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async getContractKeyValue<R extends string | boolean | Buffer>(auth: Metadata, contractId: string, key: string): Promise<R> {
    const { entry } = await this.getContractKey(auth, contractId, key);
    return entry[entry.value] as R;
  }
}
