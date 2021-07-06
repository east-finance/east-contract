import { IsNumber, IsPositive } from "class-validator";
import { ReissueParam } from "../interfaces";

export class ReissueDto implements ReissueParam {
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
  maxWestToExchange!: number;
}
