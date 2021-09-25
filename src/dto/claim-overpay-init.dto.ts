import { IsString, IsOptional } from "class-validator";

export class ClaimOverpayInitDto {
  @IsOptional()
  @IsString()
  amount!: string
}
