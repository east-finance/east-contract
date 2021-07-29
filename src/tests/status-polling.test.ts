import { EAST_SERVICE_ADDRESS } from "./config";
import { initGlobals } from "./utils";
import { Globals } from "./utils/interfaces";

let globals: Required<Globals>, contractId: string

beforeAll(async () => {
  globals = await initGlobals();
  contractId = await globals.createEastContract()
})

test('mint', () => {
  
})
