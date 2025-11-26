import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string; // e.g. "STOCK","FII","CRYPTO","ETF","REIT"

  @IsString()
  @IsNotEmpty()
  currency: string; // USD, BRL, CAD...
}
