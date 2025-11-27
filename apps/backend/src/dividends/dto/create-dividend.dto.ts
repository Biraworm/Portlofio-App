import { IsString, IsNotEmpty, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateDividendDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}


