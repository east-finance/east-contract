import { readFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "./config";
import { initGlobals } from "./utils";
import { Globals } from "./utils/interfaces";

let globals: Required<Globals>

beforeAll(async () => {
  globals = await initGlobals();
})

test('mint', async () => {
  const { weSdk, contractApi, eastServiceApi } = globals
  const result = readFileSync(PATH_TO_USER_SEEDS!)
  const parsedResult = JSON.parse(result.toString())
  const userSeed = weSdk.Seed.fromExistingPhrase(parsedResult.seeds[0])
  console.log(await contractApi.mint(userSeed, 3))
})
