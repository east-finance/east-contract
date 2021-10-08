import { IsOptional, IsNumberString, NotContains } from "class-validator";

export class ClaimOverpayInitDto {
  @IsOptional()
  @IsNumberString()
  @NotContains('-')
  amount!: string
}
