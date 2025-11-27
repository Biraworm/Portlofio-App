import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class SyncPricesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tickers: string[];
}


