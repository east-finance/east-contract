import { utils, config } from "@wavesenterprise/js-sdk";
import { Base58 } from './base58';

export const getAddressFromPublicKey = (networkByte: number, publicKey: string): string => {
  config.set({ networkByte, crypto: 'waves' })
  return utils.crypto.buildRawAddress(Base58.decode(publicKey))
}

export const getNetworkByteFromAddress = (address: string) => {
  const [, networkByte] = Base58.decode(address)
  return networkByte
}
