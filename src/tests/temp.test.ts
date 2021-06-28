import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { ConfigDto } from "../data-transfer-objects"
import { Globals, initGlobals } from "./utils"

let globals: Required<Globals>

beforeAll(async () => {
  globals = await initGlobals()
})

test('config dto validation', async () => {
  // const { rpcService } = globals
  // rpcService.handleDockerCreate()
  const configDto: ConfigDto = {
    oracleContractId: 'oracleContractId',
    oracleTimestampMaxDiff: -1,
    // @ts-ignore
    ç:  '0.5',
    westCollateral: 2.5,
    liquidationCollateral: 1.3,
    minHoldTime: 1000 * 60 * 60,
    rwaTokenId: 'Rwa token id',
    // @ts-ignore
    issueEnabled: 'yes',
  }
  const errors = await validate(plainToClass(ConfigDto, configDto))
  expect(errors.length).toBe(3)
  expect(errors.map(error => error.property)).toEqual(expect.arrayContaining(['oracleTimestampMaxDiff', 'issueEnabled', 'issueEnabled']))
})

test('temp', () => {
  expect(['a', 'b']).toStrictEqual(['b', 'a'])
})
