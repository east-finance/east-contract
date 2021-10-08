## Description of the [EAST smart contract](https://gitlab.wvservices.com/waves-enterprise/east-contract)

This smart contract creates EAST stablecoin collateralized by a defined RWA (real-world asset) and WEST token. The smart contract ensures that one EAST stablecoin is backed by not less than $1 in RWA tokens. It regulates the relationship between an EAST user and the smart contract owner (automation service).

### Brief method description:
- [mint](#mint) - EAST issuing, vault opening
- [transfer](#transfer) - EAST transferring
- [close_init](#close_init) - request to close a vault
- [close](#close) - vault closing
- [reissue](#reissue) - EAST reissuing
- [supply](#supply) - vault resupplying with WEST
- [claim_overpay_init](#claim_overpay_init) - request to claim WEST in case of overcollateralization
- [claim_overpay](#claim_overpay) - withdrawing WEST from a vault
- [liquidate](#liquidate) - vault liquidation
- [update_config](#update_config) - updating the smart contract configuration

### Smart contract creating:
The smart contract is created with the following parameters:
```js
{
  type: 'string',
  key: 'config',
  value: JSON.stringify({
    oracleContractId: 'Oracle ContractId',
    oracleTimestampMaxDiff: 10 * 60 * 1000,
    rwaPart:  0,
    westCollateral: 2.5,
    liquidationCollateral: 1.3,
    minHoldTime: 60 * 1000,
    rwaTokenId: 'RWA TokenId',
    isContractEnabled: true,
    txTimestampMaxDiff: 5 * 60 * 1000,
    decimals: 8,
    servicePublicKey: 'East Service Public Key'
  })
}
```

Where:
- oracleContractId - id of the data oracle contract with mandatory steams 000010_latest (RWA-USDap rate here) and 000003_latest (WEST rate)
- oracleTimestampMaxDiff - maximal time lag acceptable since the latest oracle data was received (in milliseconds). If exceeding this value, the transaction is not allowed.
- rwaPart - the share of RWA (real-world assets) in the collateral, the rest is backed with WEST.
- westCollateral - WEST overcollateralization ratio.
- liquidationCollateral - the lowest WEST collateralization ratio acceptable before a vault is subject to liquidation (when the WEST collateral is sold and the vault becomes 100% RWA-collateralized).
- minHoldTime - minimal lifetime of a vault before it can be closed by the user.
- rwaTokenId - a user token working as an RWA counterpart within Waves Enterprise blockchain. It has 8 decimals.
- isContractEnabled - smart contract operation blocker, in case the value is `false`.
- txTimestampMaxDiff - **optional**, `1000 * 60 * 5` ms (5 minutes) by default. Maximal time lag between the DockerCall time of a transaction and the current node time.
- decimals - a number of decimal places in EAST token.
- servicePublicKey - EAST service blockchain account public key

### Methods of the smart contract
Here a method is a parameter key to call the smart contract.

#### mint
<b>Description:</b>
Creates a user vault, converts a part of his WEST tokens to RWA, leaving the rest as the collateral, and adds EAST tokens to the user's balance. The conversion rate is provided by data oracles. If the user's vault already exists, the call is canceled.
<b>How to call:</b>
Creating an atomic transaction with transfer and contract call is recommended.
The transfer recipient is to be the one who creates the contract.
The transfer is to precede the call. Both transfer and contract call are to be sent from the same address.
<b>Method permission:</b>
Any user  

<b>Method body:</b>
```js
  transferId: string // transfer id
```  
<b>Results of execution:</b>
- `vault_${address}` key is created to store information about the user's vault with the specified address (vault id = address)
- `balance_${address}` key is created to store an amount of EAST tokens for the address
- `total_supply` key value is updated
- `exchange_${transferId}` key value is added

#### transfer
<b>Description:</b>
Transfers an amount of EAST to a specified address

<b>Method permission:</b>
An EAST token owner only

<b>Method body:</b>
```js
  to: string, // recipient
  amount: number // integer positive number
```  
<b>Results of execution:</b>
- the values of `balance_${address}` balance keys are updated for the sender and the recipient

#### close_init
<b>Description:</b>
Creates a user request to close the vault and withdraw its WEST collateral  
<b>Method permission:</b>
A vault owner. Mandatory condition: transaction.sender = vault.address  
<b>Method body:</b>
empty body  
<b>Results of execution:</b>
no results

#### close
<b>Description:</b>
Closes the user's vault and burns its EAST tokens. The automation service transfers the WEST and RWA collateral to the user. The automation service sends an atomic transaction that includes two transfers and the smart contract call. The contract checks if the sum of the transfers is equal to the sum in the vault (excluding 0.3 WEST as a commission). Also, the contract checks the sender and the recipient.
<b>Method permission:</b>
The smart contract owner  
<b>Triggers:</b>
A user calls the smart contract with `burn_init` method. After the execution the automation service sends an atomic transaction with EAST and RWA transfer, along with this contract call.
<b>Method body:</b>
```js
  address: string, // vault id
  westTransferId?: string, // optional
  rwaTransferId?: string // optional
```  
<b>Results of execution:</b>
- `balance_${address}` key value is updated; if the EAST balance is smaller than `vault.eastAmount`, the operation is not executed
- `total_supply` key value is updated
- `vault_${address}` key with the vault info is deleted

#### reissue
<b>Description:</b>
Changes the amount of tokens in the collateral and the amount of a user's EAST tokens, according to the actual conversion rate from the data oracles. The method is not executed if the WEST rate decreases.
<b>Method permission:</b>
A vault owner
<b>Method body:</b>
```js
  maxWestToExchange: number
```  
`maxWestToExchange` - maximal amount of WEST to be exchanged to EAST.  
<b>Results of execution:</b>
- `vault_${vault.id}` key with a vault information is updated
- `balance_${address}` key is updated, if the new and the old value of `eastAmount` are different
- `total_supply` is updated, if the new and the old value of `eastAmount` are different

#### supply
<b>Description:</b>
In case of WEST rate drops, a user provides extra collateral to avoid liquidation of his vault. The smart contract transfers the added WEST tokens to the user's vault.  
<b>How to call:</b>
Creating an atomic transaction with a transfer and a contract call is recommended.
The transfer recipient is to be the owner of the smart contract.   
The transfer is to precede the call. Both transfer and contract calls are to be sent from the same address.  
<b>Method permission:</b>
A vault owner  
<b>Method body:</b>
```js
  transferId: string // transfer tx id
```  
<b>Results of execution:</b>
- `vault_${address}` key with the information about the user's vault is updated

#### claim_overpay_init
<b>Description:</b>
A user request to withdraw his WEST overcollateral from the vault, in case of WEST rate growth
<b>Method permission:</b>
The vault owner  
<b>Method body:</b>
```js
  amount: number // optional, amount to withdraw
```  
<b>Results of execution:</b>
no result

#### claim_overpay
<b>Description:</b>
The smart contract owner calls it after calling `claim_overpay_init`, transfers WEST tokens to the smart contract owner. The contract writes off the transferred tokens from the user's vault, decreases the westAmount value accordingly and writes off extra 0.2 WEST as a commission.
<b>Method permission:</b>
The smart contract owner  
<b>Triggers:</b>
A user calls the contract with `claim_overpay_init` method. In case of overcollateralization, the automation service calculates how many tokens are to be returned to the user. Then the service sends an atomic transaction with WEST transfer and the contract call. If the vault is not overcollateralized, `claim_overpay_init` call is ignored.
<b>Method body:</b>
```js
  address: string, // vault id
  transferId: string,
  requestId: string // claim_overpay_init call id
```  
<b>Results of execution:</b>
- `exchange_${transferId}` key is added
- `vault_${address}` key is updated

#### liquidate
<b>Description:</b>
If EAST collateralization with WEST falls below `liquidationCollateral` value from the smart contract configuration as a result of WEST rate drop, then any user can buy out the WEST from the vault. To do it, he needs to create an atomic transaction with RWA token transfer to the smart contract address, along with `CallContract` with `liquidate` method containing `transferId` and `address` values. The amount of RWA tokens transferred is to be the same as the amount of EAST in the vault. The contract checks the latest data oracle information to verify that the actual collateralization rate is lower than `liquidationCollateral`. If yes, the contract writes the following values to the vault: `rwaAmount = eastAmount`, `westAmount = 0`, `liquidatedWestAmount = vaultWestAmount`. Then the user can no longer close the vault. If WEST collateralization is above `liquidationCollateral`, the method is not called.
<b>Method permission:</b>
The smart contract owner (the automation service)  
<b>Method body:</b>
```js
  address: string // vault address
  transferId: string // id of RWA transfer transaction
```  
<b>Results of execution:</b>
- `vault_${address}` key value is updated as an empty string
- `liquidated_vault_${address}_<tx_timestamp>` key with the data about the luquidated vault is created

#### write_liquidation_west_transfer
<b>Description:</b>
This method writes the key with the information about the sent transfer transaction into the state, as a response to a vault liquidation. This key tells the automation service whether the WEST tokens were sent to the liquidator's address or not.
<b>Method permission:</b>
The smart contract owner (the automation service)  
<b>Method body:</b>
```js
  address: string,
  timestamp: number,
```  
<b>Results of execution:</b>
- `liquidation_exchange_${address}_${timestamp}` key is added

#### update_config
<b>Description:</b>
This method updates the configuration. The parameters are described is the "Smart contract creating" section above.
<b>Method permission:</b>
The smart contract owner (the Automation Service)  
<b>Method body:</b>
```js
  oracleContractId: string,
  oracleTimestampMaxDiff: number,
  rwaPart: number,
  westCollateral: number,
  liquidationCollateral: number,
  minHoldTime: number,
  rwaTokenId: string,
  isContractEnabled: boolean,
  decimals: number,
  servicePublicKey: string
```  
<b>Results of execution:</b>
- `config` key of the contract that stores parameters is updated

## Running tests
Requirements: Docker, NodeJs

#### NOTE: Parts 1-3 must be completed only when the sandbox is first set up

### Part 1. Configure sandbox
1) Install the node sandbox to <sandbox_dir>: https://docs.wavesenterprise.com/ru/latest/how-to-setup/sandbox.html
2) Update the `docker-engine` section of the node config, that is to be found in `<sandbox_dir>/config/nodes/node-*/node.conf`, as follows:
    ```
    docker-engine {
      enable = "yes"
      use-node-docker-host = "yes"
      execution-limits {
        timeout = "100s"
        memory = 1024
        memory-swap = 0
        startup-timeout = "100s"
      }
      remove-container-on-fail = "no"
      remove-container-after = "30m"
    }
    ```
    ```
    pre-activated-features {
      2 = 0
      3 = 0
      4 = 0
      5 = 0
      6 = 0
      7 = 0
      9 = 0
      10 = 0
      100 = 0
      101 = 0
      120 = 0
      140 = 0
      162 = 0
    }
    ```
3) Restart docker-compose
4) Check that node is running and available: http://localhost/node-0/api-docs/index.html#/

### Part 2. Configure permissions and balances
1) Go to blockchain client (http://localhost/) and transfer WEST tokens to addresses created from following seed phrases:

```
admin seed phrase // 1000 WEST
service seed phrase // 1000 WEST
user1 seed phrase // 100 WEST
user2 seed phrase // 100 WEST
```

Seed phrases used in tests can be modified in `src/e2e/tests/constants.ts`

2) Grant `contract_developer` and `issuer` permissions to address from seed phrase `admin seed phrase`

### Part 3. Create oracles contract and USDap token

#### In following operations use `admin seed phrase` account:

1) Create oracle docker contract using image `grpc-contract-example:v2.2`. Write id of new contract to `oracleContractId` variable in file `src/e2e/tests/constants.ts`
2) Issue new native token named RWAToken. Write id of new token to `rwaTokenId` variable in file `src/e2e/tests/constants.ts`

### Part 4. Run test suite
```
npm i
npm run test
```
