import { IsBoolean, IsPositive, IsString, IsOptional } from "class-validator"
import { ConfigParam } from "../interfaces"

export class ConfigDto implements Omit<ConfigParam, 'adminAddress' | 'adminPublicKey'> {
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

  @IsOptional()
  @IsBoolean()
  issueEnabled!: boolean
}
