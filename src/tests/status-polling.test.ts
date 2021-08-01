import { readFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "./config";
import { initGlobals } from "./utils";
import { Globals } from "./utils/interfaces";

let globals: Required<Globals>

beforeAll(async () => {
  globals = await initGlobals();
})

test('mint', () => {
  const result = readFileSync(PATH_TO_USER_SEEDS!)
  console.log(JSON.parse(result.toString()))
})
