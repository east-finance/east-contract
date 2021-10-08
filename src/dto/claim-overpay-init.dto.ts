import { IsOptional, IsNumberString } from "class-validator";

export class ClaimOverpayInitDto {
  @IsOptional()
  @IsNumberString()
  amount!: string
}
