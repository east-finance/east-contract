import { ConfigDto } from "../dto/config.dto"
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
    expect(error.message.includes('oracleTimestampMaxDiff'))
    expect(error.message.includes('rwaPart'))
    expect(error.message.includes('issueEnabled'))
    expect(error.message).toBe('Validation error: oracleTimestampMaxDiff must be a positive number, rwaPart must be a positive number, issueEnabled must be a boolean value')
  }
})

test('mint test validation', async () => {
  const { rpcService, createTx } = globals
  const invalidData = {
    transferId: 1 // invalid
  }
  try {
    await rpcService.handleDockerCall(createTx(104, 'mint', invalidData))
  } catch (e) {
    expect(e.message.includes('transferId'))
    console.log(e)
  }
})
