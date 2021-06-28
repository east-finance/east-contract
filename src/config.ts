import { config } from 'dotenv'
import * as path from 'path';

const envs = config({ path: path.resolve(process.cwd(), '.env.test') })

export const CONNECTION_ID = process.env.CONNECTION_ID || '';
export const CONNECTION_TOKEN = process.env.CONNECTION_TOKEN || '';
export const NODE = process.env.NODE || '';
export const NODE_PORT = process.env.NODE_PORT || '';
export const HOST_NETWORK = process.env.HOST_NETWORK || '';
export const IS_TESTING_ENV = envs.error === undefined ? envs?.parsed?.IS_TESTING_ENV : false
