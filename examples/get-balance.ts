import path from 'path';
import nodeFetch from 'node-fetch'
import { loadSync } from '@grpc/proto-loader';
import { credentials, GrpcObject, loadPackageDefinition } from '@grpc/grpc-js';
import { StateService } from '../src/services/StateService'
import { ServiceClientConstructor } from '@grpc/grpc-js/build/src/make-client';

const CONTRACT_PROTO = path.resolve(__dirname, '../src', 'protos', 'contract', 'contract_contract_service.proto');
const TRANSACTIONS_PROTO = path.resolve(__dirname, '../src', 'protos', 'contract', 'contract_transaction_service.proto');
const ADDRESS_PROTO = path.resolve(__dirname, '../src', 'protos', 'contract', 'contract_address_service.proto');
const PROTO_DIR = path.join(__dirname, '../src', 'protos')


const definitions = loadSync(
  [TRANSACTIONS_PROTO, CONTRACT_PROTO, ADDRESS_PROTO],
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [PROTO_DIR],
  },
);

const proto = loadPackageDefinition(definitions).wavesenterprise as GrpcObject;
const ContractService = proto.ContractService as ServiceClientConstructor;
const TransactionService = proto.TransactionService as ServiceClientConstructor;
const AddressService = proto.AddressService as ServiceClientConstructor;

const client = new ContractService(`${'51.178.69.186'}:${'6865'}`, credentials.createInsecure());
const txClient = new TransactionService(`${'51.178.69.186'}:${'6865'}`, credentials.createInsecure());
const addressService = new AddressService(`${'51.178.69.186'}:${'6865'}`, credentials.createInsecure());
const stateService = new StateService(client, txClient, addressService);

async function main() {
  const fetch = (url: RequestInfo, options?: RequestInit): Promise<Response> => {
    // @ts-ignore
    return nodeFetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'x-api-key': 'we',
        'Content-Type': 'application/json',
      },
    });
  }

  const r = await fetch('http://localhost:6862/node-0/debug/createGrpcAuth', {
    method: 'POST',
    headers: {
      'X-API-KEY': 'we'
    },
    body: {
      // @ts-ignore
      contractId: 'ASAeTQ3SuimmtQxmcJjgQMRufiXg58ELBVcv2er5YEFS'
    },
  })
  console.log(r)
  try {
    const r = await stateService.getAssetBalance('3Ny3vjNsoNyX6afHdv7byVNHoMV7CYSHkUz', '6Cc3dePRVFwn4VX6NZuwS2R9wDHU6z2eoKhZ7MdJ1fkR')
    console.log(r)  
  } catch (e) {
    console.log(e.message)
  }
}
main()
