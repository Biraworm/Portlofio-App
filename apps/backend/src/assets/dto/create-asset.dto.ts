import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  averagePrice?: number;
}

