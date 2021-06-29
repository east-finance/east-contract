import { DataEntryRequest } from "../interfaces";
import { StateService } from "../services/StateService";

export const StateServiceMock: StateService = {
  commitSuccess(txId: string, results: DataEntryRequest[]) {}
} as StateService
