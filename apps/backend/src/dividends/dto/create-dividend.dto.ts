import { IsString, IsNotEmpty, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateDividendDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  type: string; // "DIVIDEND", "JCP", "RENDIMENTO"

  @IsDateString()
  @IsNotEmpty()
  date: string;
}


