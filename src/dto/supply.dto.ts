import { IsString } from "class-validator";
import { SupplyParam } from "../interfaces";

export class SupplyDto implements SupplyParam {
  @IsString()
  transferId!: string
}
