import { WeSdk } from "@wavesenterprise/js-sdk"

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

function generateUserSeedPhrase() {
  let result = ''
  for (let i = 0; i < 5; i++) {
    result = result + generateWord(5) + ' '
  }
  return result.slice(0, -1)
}

export function createRandomSeed(weSdk: WeSdk) {
  const userSeedPhrase = generateUserSeedPhrase()
  return weSdk.Seed.fromExistingPhrase(userSeedPhrase)
}
