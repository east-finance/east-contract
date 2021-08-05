import { readFileSync } from "fs";
import { NODE_ADDRESS, PATH_TO_USER_SEEDS } from "../config";
import { initGlobals } from "../utils";
import { runPolling } from "../utils/polling";

async function main() {
  const { weSdk, minimumFee, seed: ownerSeed, fetch } = await initGlobals()
  
}

main()
