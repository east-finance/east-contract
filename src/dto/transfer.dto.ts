import { IsNumber, IsPositive, IsString } from "class-validator";
import { TransferParam } from "../interfaces";

export class TransferDto implements TransferParam {
  @IsString()
  to!: string;

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
  amount!: number;
}
