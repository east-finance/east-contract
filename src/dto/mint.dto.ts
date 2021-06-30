import { IsString } from "class-validator";
import { MintParam } from "../interfaces";

export class MintDto implements MintParam {
  @IsString()
  transferId!: string
}
