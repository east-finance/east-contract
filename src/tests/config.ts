import * as path from 'path'
import { config, DotenvConfigOutput } from "dotenv"

const REQUIRED_ENVS = {
  NODE_ADDRESS: '',
  SEED_PHRASE: '',
}

type Envs = Omit<DotenvConfigOutput, 'parsed'> & { parsed: typeof REQUIRED_ENVS }

const envs = config({ path: path.resolve(process.cwd(), '.env.test') }) as Envs

function validateEnvs() {
  const missingVariables = []
  const parsedEnvs = Object.keys(envs.parsed)
  for (const requiredEnv of Object.keys(REQUIRED_ENVS)) {
    if (!parsedEnvs.includes(requiredEnv)) {
      missingVariables.push(requiredEnv)
    }
  }
  if (missingVariables.length > 0) {
    throw new Error(`The following env variables are missing: ${missingVariables.join(', ')}`)
  }
}
validateEnvs()

export const { NODE_ADDRESS, SEED_PHRASE } = envs.parsed
