import { IsBoolean, IsPositive, IsString } from "class-validator"

export class ConfigDto {
  @IsString()
  oracleContractId!: string

  @IsPositive()
  oracleTimestampMaxDiff!: number

  @IsPositive()
  rwaPart!:  number

  @IsPositive()
  westCollateral!: number

  @IsPositive()
  liquidationCollateral!: number

  @IsPositive()
  minHoldTime!: number

  @IsString()
  rwaTokenId!: string

  @IsBoolean()
  issueEnabled!: boolean
}
