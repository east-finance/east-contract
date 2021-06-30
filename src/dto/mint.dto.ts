import { IsString } from "class-validator";

export class MintDto {
  @IsString()
  transferId!: string
}
