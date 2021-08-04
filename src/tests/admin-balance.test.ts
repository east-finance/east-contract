import { Operations } from "../interfaces"
import { initGlobals } from "./utils"
import { createTx } from "./utils/create-fake-tx";

let globals: ReturnType<typeof initGlobals>

beforeAll(async () => {
  globals = await initGlobals()
  const { rpcService } = globals;
  (rpcService as any).stateService.isVaultExists = () => false;
  (rpcService as any).stateService.getTotalSupply = () => 0;
  (rpcService as any).stateService.getBalance = () => 0;
  (rpcService as any).getLastOracles = () => ({ westRate: 1, rwaRate: 1 });
  (rpcService as any).stateService.getTotalRwa = () => Promise.resolve(0);
  (rpcService as any).calculateVault = () => ({
    eastAmount: 1000,
    rwaAmount: 100_000_000_000_000,
    westAmount: 10000,
    westRate: 0.1,
    rwaRate: 0.1,
    liquidationCollateral: 0.1,
  });
  (rpcService as any).checkTransfer = () => Promise.resolve(1000);
  (rpcService as any).stateService.getAssetBalance = () => Promise.resolve({
    assetId: '',
    amount: 10_000_000_000_000,
    decimals: 8,
  });
})

test('Exceeding the limit on the admin balance', async () => {
  const { rpcService } = globals;
  try {
    await rpcService.handleDockerCall(createTx(104, Operations.mint, { transferId: 'FXrPghoPDvGryyXuJAY6S4DPyKT6HBnELa3KSeVT79m2' }))
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
  }
})
