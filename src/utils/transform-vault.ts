import BigNumber from "bignumber.js";
import { Vault, VaultView } from "../interfaces";
import { MULTIPLIER } from "../services/RPCService";

export function stringifyVault(vault: Vault): string {
  return JSON.stringify({
    ...vault,
    eastAmount: vault.eastAmount.multipliedBy(MULTIPLIER).toString(),
    westAmount: vault.westAmount.multipliedBy(MULTIPLIER).toString(),
    rwaAmount: vault.rwaAmount.multipliedBy(MULTIPLIER).toString(),
    liquidationCollateral: parseFloat(vault.liquidationCollateral.toString()),
    westRate: {
      ...vault.westRate,
      value: parseFloat(vault.westRate.value.toString())
    },
    rwaRate: {
      ...vault.rwaRate,
      value: parseFloat(vault.rwaRate.value.toString()),
    }
  } as VaultView)
}

export function parseVault(vaultJson: string): Vault {
  const vaultView: VaultView = JSON.parse(vaultJson)
  return {
    ...vaultView,
    eastAmount: new BigNumber(vaultView.eastAmount).dividedBy(MULTIPLIER),
    westAmount: new BigNumber(vaultView.westAmount).dividedBy(MULTIPLIER),
    rwaAmount: new BigNumber(vaultView.rwaAmount).dividedBy(MULTIPLIER),
    liquidationCollateral: new BigNumber(vaultView.liquidationCollateral),
    westRate: {
      ...vaultView.westRate,
      value: new BigNumber(vaultView.westRate.value)
    },
    rwaRate: {
      ...vaultView.rwaRate,
      value: new BigNumber(vaultView.rwaRate.value)
    }
  } as Vault
}
