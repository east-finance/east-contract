import { IsNumber, IsPositive } from "class-validator";

export class ClaimOverpayInitDto {
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 8,
    },
    {
      message: '$property must be a number (decimal) with no more than 8 decimal places'
    }
  )
  @IsPositive()
  amount!: number
}
