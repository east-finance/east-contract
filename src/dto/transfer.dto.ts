import { IsNumber, IsPositive, IsString } from "class-validator";
import { TransferParam } from "../interfaces";

export class TransferDto implements TransferParam {
  @IsString()
  to!: string;

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
  amount!: number;
}
