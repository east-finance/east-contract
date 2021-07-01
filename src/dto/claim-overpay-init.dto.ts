import { IsPositive } from "class-validator";

export class ClaimOverpayInitDto {
  @IsPositive()
  amount!: number
}
