export const nodeAddress = 'http://localhost/node-0';
export const imageName = 'east-contract:1.111'

// Seed phrases
export const adminSeedPhrase = 'examples seed phrase';
export const serviceSeedPhrase = 'service public key1';
export const user1SeedPhrase = 'examples seed phrase another one';
export const user2SeedPhrase = 'examples seed phrase another two';

// Contract settings
export const oracleContractId = 'EiuvA4yzBokBXScE3qDzxexj3xqQ4zG9K7Jr6Y6bc7is';
export const rwaTokenId = '5Y4oMP6yvoi1gd64zGymGT93HLUgAxmARL3DHkgKZWAc';

// Interfaces
export enum TxStatus {
  success = 'Success',
  error = 'Error'
}

export enum OracleStream {
  WEST = '000003_latest',
  USDap = '000010_latest',
}
