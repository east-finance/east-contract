export const nodeAddress = 'http://localhost/node-0';
export const imageName = 'east-contract:1.111'

// Can be edited for new sandbox
export const adminSeedPhrase = 'admin seed phrase'; // Must have 'contract_developer',  'issuer' permissions and WEST tokens on balance
export const serviceSeedPhrase = 'service seed phrase'; // Must have WEST tokens on balance
export const user1SeedPhrase = 'user1 seed phrase'; // Must have WEST tokens on balance
export const user2SeedPhrase = 'user2 seed phrase'; // Must have WEST tokens on balance

// IMPORTANT: Must be edited after create new sandbox
export const oracleContractId = '5XUHAB1eyPMWvjoarC13hwMWh5zXYepTRTyZXVXXKKnN';
export const rwaTokenId = '3K4Bqhbx4w3bz7SKeQGi5HfLgceN2jCMCPL9rihP9NA8';

/////////////////////////////////////////////
// Interfaces
export enum TxStatus {
  success = 'Success',
  error = 'Error'
}

export enum OracleStream {
  WEST = '000003_latest',
  USDap = '000010_latest',
}
