import { IsString, IsOptional } from "class-validator";
import { CloseParam } from "../interfaces";

export class CloseDto implements CloseParam {
  @IsString()
  address!: string;
  
  @IsOptional()
  @IsString()
  westTransferId!: string;
  
  @IsOptional()
  @IsString()
  rwaTransferId!: string;
}
