import { IsString } from 'class-validator';
import { LiquidateParam } from '../interfaces';

export class LiquidateDto implements LiquidateParam {
  @IsString()
  address!: string;

  @IsString()
  transferId!: string
}
