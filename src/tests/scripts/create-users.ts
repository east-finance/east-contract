import { writeFileSync } from "fs";
import { PATH_TO_USER_SEEDS } from "../config";
import { initGlobals } from "../utils";

function generateWord(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

function generateUserSeed() {
  let result = ''
  for (let i = 0; i < 15; i++) {
    result = result + generateWord(5) + ' '
  }
  return result
}

async function main(count: number = 1) {
  const globals = await initGlobals()
  const result: any = {
    seeds: []
  }
  for (let i = 0; i < count; i++) {
    result.seeds.push(generateUserSeed())
  }
  writeFileSync(PATH_TO_USER_SEEDS!, JSON.stringify(result))
}

const count: number | undefined = process.env.COUNT === undefined ? undefined : parseInt(process.env.COUNT, 10)

main(count)
