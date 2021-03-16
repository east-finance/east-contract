import { Metadata } from '@grpc/grpc-js';
import { DataEntryRequest, DataEntryResponse, StateKeys } from '../interfaces';

export class StateService {
  private auth = new Metadata();
  private contractId = '';
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  setAuthData(auth: Metadata, contractId: string): void {
    this.auth = auth;
    this.contractId = contractId;
  }

  commitError(txId: string, message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.commitExecutionError({
        tx_id: txId,
        message,
      }, this.auth, function (error: Error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  commitSuccess = (txId: string, results: DataEntryRequest[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.client.commitExecutionSuccess({
        tx_id: txId,
        results,
      }, this.auth, function (error: Error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };

  getContractKey(key: string): Promise<{ entry: DataEntryResponse }> {
    return new Promise((resolve, reject) => {
      this.client.getContractKey({
        contract_id: this.contractId,
        key,
      }, this.auth, function (error: Error, response: { entry: DataEntryResponse }) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async getContractKeyValue<R extends string | boolean | Buffer>(key: string): Promise<R> {
    const { entry } = await this.getContractKey(key);
    return entry[entry.value] as R;
  }

  async getTotalSupply (): Promise<number> {
    const value = await this.getContractKeyValue(StateKeys.totalSupply);
    return value ? Number(value) : 0;
  }

  async getBalance (address: string): Promise<number> {
    try {
      const value = await this.getContractKeyValue(`${StateKeys.balance}_${address}`);
      return Number(value);
    } catch(e) {
      return 0;
    }
  }
}
