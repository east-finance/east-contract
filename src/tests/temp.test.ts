import { ConfigDto } from "../dto/config.dto"
import { TransferDto } from "../dto/transfer.dto"
import { Operations } from "../interfaces"
import { Globals, initGlobals } from "./utils"

let globals: Required<Globals>

beforeAll(async () => {
  globals = await initGlobals()
})

test('config dto validation', async () => {
  const { rpcService, createTx } = globals
  const invalidConfig: ConfigDto = {
    oracleContractId: 'oracleContractId',
    oracleTimestampMaxDiff: -1, // invalid
    // @ts-ignore
    rwaPart: '0.5', // invalid
    westCollateral: 2.5,
    liquidationCollateral: 1.3,
    minHoldTime: 1000 * 60 * 60,
    rwaTokenId: 'Rwa token id',
    // @ts-ignore
    issueEnabled: 'yes', // invalid
  }
  try {
    await rpcService.handleDockerCreate(createTx(103, 'config', invalidConfig))
  } catch (error) {
    expect(error.message.includes('oracleTimestampMaxDiff')).toBeTruthy()
    expect(error.message.includes('rwaPart')).toBeTruthy()
    expect(error.message.includes('issueEnabled')).toBeTruthy()
    expect(error.message).toBe('Validation error: oracleTimestampMaxDiff must be a positive number, rwaPart must be a positive number, issueEnabled must be a boolean value')
  }
})

test('mint dto validation', async () => {
  const { rpcService, createTx } = globals
  const invalidData = {
    transferId: 1 // invalid
  }
  try {
    await rpcService.handleDockerCall(createTx(104, Operations.mint, invalidData))
  } catch (e) {
    expect(e.message.includes('transferId')).toBeTruthy()
  }
})

test('transfer dto validation', async () => {
  const { rpcService, createTx } = globals
  const invalidData: TransferDto = {
    // @ts-ignore
    to: true, // invalid
    amount: -1, // invalid
  }
  try {
    await rpcService.handleDockerCall(createTx(104, Operations.transfer, invalidData))
  } catch (e) {
    expect(e.message.includes('to')).toBeTruthy()
    expect(e.message.includes('amount')).toBeTruthy()
  }
})
