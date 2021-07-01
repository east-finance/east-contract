import { IsPositive } from "class-validator";
import { ReissueParam } from "../interfaces";

export class ReissueDto implements ReissueParam {
  @IsPositive()
  maxWestToExchange!: number;
}
