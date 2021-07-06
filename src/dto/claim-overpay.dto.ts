import { IsString } from "class-validator";
import { ClaimOverpayParam } from "../interfaces";

export class ClaimOverpayDto implements ClaimOverpayParam {
  @IsString()
  address!: string;

  @IsString()
  transferId!: string;

  @IsString()
  requestId!: string;
}
