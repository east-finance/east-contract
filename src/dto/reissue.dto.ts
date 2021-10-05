import { IsNumber, IsPositive, IsOptional } from "class-validator";
import { ReissueParam } from "../interfaces";

export class ReissueDto implements ReissueParam {
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: '$property must be a positive integer number'
    }
  )
  @IsPositive()
  maxWestToExchange!: number;
}
