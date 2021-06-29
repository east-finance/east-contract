import { ConfigDto } from "../dto/config.dto"
import { Globals, initGlobals } from "./utils"

let globals: Required<Globals>

beforeAll(async () => {
  globals = await initGlobals()
})

test('config dto validation', async () => {
  const { rpcService } = globals
  const invalidConfig: ConfigDto = {
    oracleContractId: 'oracleContractId',
    oracleTimestampMaxDiff: -1,
    // @ts-ignore
    rwaPart: '0.5',
    westCollateral: 2.5,
    liquidationCollateral: 1.3,
    minHoldTime: 1000 * 60 * 60,
    rwaTokenId: 'Rwa token id',
    // @ts-ignore
    issueEnabled: 'yes',
  }
  try {
    await rpcService.handleDockerCreate({
      id: '',
      type: 103,
      sender: 'sender',
      sender_public_key: 'pk',
      contract_id: 'contract_id',
      fee: 1000,
      version: 1,
      proofs: Buffer.from(''),
      timestamp: Date.now(),
      fee_asset_id: {
        value: 'fee_asset_id',
      },
      params: [
        {
          key: 'config',
          value: 'string_value',
          string_value: JSON.stringify(invalidConfig)
        }
      ],
    })
  } catch (error) {
    expect(typeof error.message).toBe('string')
    expect(error.message.includes('oracleTimestampMaxDiff'))
    expect(error.message.includes('rwaPart'))
    expect(error.message.includes('issueEnabled'))
    expect(error.message).toBe('Validation error: oracleTimestampMaxDiff must be a positive number, rwaPart must be a positive number, issueEnabled must be a boolean value')
  }
})
