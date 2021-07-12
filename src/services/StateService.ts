import { Metadata } from '@grpc/grpc-js';
import { ConfigParam, DataEntryRequest, DataEntryResponse, StateKeys, Vault } from '../interfaces';
import { Base58 } from '../utils/base58'
import { createLogger } from '../utils/logger';

const logger = createLogger('State service');


export class StateService {
  private auth = new Metadata();
  private contractId = '';
  private contractClient: any;
  private txClient: any;
  private addressService: any;

  constructor(contractClient: any, txClient: any, addressService: any) {
    this.contractClient = contractClient;
    this.txClient = txClient;
    this.addressService = addressService
  }

  setAuthData(auth: Metadata, contractId: string): void {
    this.auth = auth;
    this.contractId = contractId;
  }

  getTransactionInfoOrFail<T>(txId: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.txClient.transactionInfo({
        tx_id: txId,
      }, this.auth, function (error: Error, response: any) {
        if (error) {
          const { metadata } = error as any;
          const { internalRepr } = metadata
          reject(new Error(`Error: ${internalRepr.get('errorCode')}: ${internalRepr.get('errorMessage')}`));
          return
        }
        try {
          const transactionFiled = response.transaction.transaction
          const transactionFromRequest = response.transaction[transactionFiled]
          if (!transactionFromRequest) {
            throw new Error('Unknown transaction')
          }
          logger.info(`getTransactionInfoOrFail raw:`)
          logger.info(Base58.encode(transactionFromRequest.id))
          logger.info(JSON.stringify(transactionFiled))
          logger.info(JSON.stringify(transactionFromRequest))

          const transaction = {
            ...transactionFromRequest,
            id: Base58.encode(transactionFromRequest.id),
            contract_id: transactionFromRequest.contract_id ? Base58.encode(transactionFromRequest.contract_id) : '',
            sender_public_key: Base58.encode(transactionFromRequest.sender_public_key),
            recipient: transactionFromRequest.recipient ? Base58.encode(transactionFromRequest.recipient) : '',
            asset_id: transactionFromRequest.asset_id ? Base58.encode(transactionFromRequest.asset_id.value || transactionFromRequest.asset_id) : '',
            attachment: transactionFromRequest.attachment ? Base58.encode(transactionFromRequest.attachment) : ''
          }
          resolve(transaction)
        } catch (err) {
          reject(err)
        }
      })
    })
  }


  commitError(txId: string, message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.contractClient.commitExecutionError({
        tx_id: txId,
        message,
      },
      this.auth,
      function (error: Error) {
        if (error) {
          const { metadata } = error as any;
          const { internalRepr } = metadata
          reject(new Error(`Error: ${internalRepr.get('errorCode')}: ${internalRepr.get('errorMessage')}`));
          return
        }
        resolve();
      });
    });
  }

  commitSuccess = (txId: string, results: DataEntryRequest[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.contractClient.commitExecutionSuccess({
        tx_id: txId,
        results,
      },
      this.auth,
      function (error: Error) {
        if (error) {
          const { metadata } = error as any;
          const { internalRepr } = metadata
          reject(new Error(`Error: ${internalRepr.get('errorCode')}: ${internalRepr.get('errorMessage')}`));
          return
        }
        resolve();
      });
    });
  };

  getContractKey(key: string, contractId = this.contractId): Promise<{ entry: DataEntryResponse }> {
    return new Promise((resolve, reject) => {
      this.contractClient.getContractKey({
        contract_id: contractId,
        key,
      },
      this.auth,
      function (error: Error, response: { entry: DataEntryResponse }) {
        if (error) {
          const { metadata } = error as any;
          const { internalRepr } = metadata
          const internalReprKeysAndValues = []
          for (let [key, value] of internalRepr.entries()) {
            internalReprKeysAndValues.push(`${key}: ${value}`)            
          }
          reject(new Error(`GRPC Node error. Key - ${key}. ${internalReprKeysAndValues.join(', ')}`));
          return
        }
        resolve(response);
      });
    });
  }

  async getContractKeyValue<R extends string | boolean | Buffer>(key: string, contractId?: string): Promise<R> {
    const { entry } = await this.getContractKey(key, contractId);
    return entry[entry.value] as R;
  }

  async getTotalSupply(): Promise<number> {
    const value = await this.getContractKeyValue(StateKeys.totalSupply);
    return value ? Number(value) : 0;
  }

  async getTotalRwa(): Promise<number> {
    const value = await this.getContractKeyValue(StateKeys.totalRwa);
    return value ? Number(value) : 0;
  }

  async getBalance(address: string): Promise<number> {
    try {
      const value = await this.getContractKeyValue(`${StateKeys.balance}_${address}`);
      return Number(value);
    } catch (e) {
      return 0;
    }
  }

  async isTransferUsed(transferId: string): Promise<boolean> {
    try {
      const value = await this.getContractKeyValue(`${StateKeys.exchange}_${transferId}`);
      return !!value
    } catch (e) {
      return false
    }
  }

  async getConfig(): Promise<ConfigParam> {
    const value = await this.getContractKeyValue(StateKeys.config);
    const {
      oracleContractId,
      oracleTimestampMaxDiff,
      rwaPart,
      westCollateral,
      liquidationCollateral,
      minHoldTime,
      adminAddress,
      adminPublicKey,
      issueEnabled,
      rwaTokenId
    } = JSON.parse(value as string)
    if (!oracleContractId || !oracleTimestampMaxDiff || !rwaPart || !westCollateral || !liquidationCollateral) {
      throw new Error('Wrong config contract param')
    }
    return {
      oracleContractId,
      oracleTimestampMaxDiff,
      rwaPart,
      westCollateral,
      liquidationCollateral,
      minHoldTime,
      adminAddress,
      adminPublicKey,
      issueEnabled,
      rwaTokenId
    }
  }

  async getVault(vaultId: string): Promise<Vault> {
    const value = await this.getContractKeyValue(`${StateKeys.vault}_${vaultId}`);
    const vault = JSON.parse(value as string) as Vault;
    if (!vault) {
      throw new Error(`vault ${vaultId} does not exist`);
    }
    if (vault.liquidated) {
      throw new Error(`vault ${vaultId} liquidated`);
    }
    return vault;
  }

  async isVaultExists(vaultId: string): Promise<boolean> {
    try {
      const value = await this.getContractKeyValue(`${StateKeys.vault}_${vaultId}`);
      const vault = JSON.parse(value as string) as Vault;
      if (vault && vault.rwaAmount) {
        return true;
      }
      return false;
    } catch (e) {
      return false
    }
  }

  async getAssetBalance(address: string, assetId: string): Promise<{ assetId: string, amount: number, decimals: number }> {
    return new Promise((resolve, reject) => {
      this.addressService.getAssetBalance(
        {
          address: Base58.decode(address),
          assetId: {
            value: Base58.decode(assetId)
          }
        },
        this.auth,
        function (error: Error, response: any) {
          if (error) {
            const { metadata } = error as any;
            const { internalRepr } = metadata
            reject(new Error(`Error: ${internalRepr.get('errorCode')}: ${internalRepr.get('errorMessage')}`));
            return
          }
          resolve({
            assetId: response.assetId ? Base58.encode(response.assetId.value || response.asset_id) : '',
            amount: response.amount,
            decimals: response.decimals,
          })
        }
      )
    })
  }
}
