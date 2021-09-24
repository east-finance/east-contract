import { utils } from "@wavesenterprise/js-sdk";
import { Base58 } from './base58';

export const getAddressFromPublicKey = (publicKey: string): string => {
  return utils.crypto.buildRawAddress(Base58.decode(publicKey))
}
