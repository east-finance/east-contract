import { IsString } from "class-validator";
import { CloseParam } from "../interfaces";

export class CloseDto implements CloseParam {
  @IsString()
  address!: string;
  
  @IsString()
  westTransferId!: string;
  
  @IsString()
  rwaTransferId!: string;
}
