import { EAST_SERVICE_ADDRESS } from "./config";
import { initGlobals } from "./utils";
import { Globals } from "./utils/interfaces";

let globals: Required<Globals>

beforeAll(async () => {
  globals = await initGlobals();
})

test('mint', () => {
  
})
