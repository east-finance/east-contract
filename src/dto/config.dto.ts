import { IsBoolean, IsPositive, IsString, IsOptional, IsNumber } from "class-validator"
import { ConfigParam } from "../interfaces"

export class ConfigDto implements Omit<ConfigParam, 'adminAddress' | 'adminPublicKey' | 'rwaPart' | 'westCollateral' | 'liquidationCollateral'> {
  @IsString()
  oracleContractId!: string

  @IsPositive()
  oracleTimestampMaxDiff!: number

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
  rwaPart!:  number

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
  westCollateral!: number

  @IsPositive()
  liquidationCollateral!: number

  @IsPositive()
  minHoldTime!: number

  @IsString()
  rwaTokenId!: string

  @IsOptional()
  @IsBoolean()
  isContractEnabled!: boolean

  @IsOptional()
  @IsPositive()
  txTimestampMaxDiff!: number
}
