import { IsPositive, IsString } from "class-validator";
import { TransferParam } from "../interfaces";

export class TransferDto implements TransferParam {
  @IsString()
  to!: string;

  @IsPositive()
  amount!: number;
}
