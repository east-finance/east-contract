import { readFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "./config";
import { initGlobals } from "./utils";
import { Globals } from "./utils/interfaces";

let globals: Required<Globals>

beforeAll(async () => {
  globals = await initGlobals();
})

test('RWA part 0', async () => {
  const { contractApi, weSdk } = globals
  const userSeedsResult = readFileSync(PATH_TO_USER_SEEDS!)
  const parsedUserSeedsResult = JSON.parse(userSeedsResult.toString())
  const userSeed = weSdk.Seed.fromExistingPhrase(parsedUserSeedsResult.seeds[0])
  const mintTxId = await contractApi.mint(userSeed, 4)
  console.log(mintTxId)
})
