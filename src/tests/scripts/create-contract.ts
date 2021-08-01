import { initGlobals } from "../utils";

async function main() {
  const globals = await initGlobals()
  const contractId = await globals.contractApi.createEastContract();
  console.log(contractId)
}

main();