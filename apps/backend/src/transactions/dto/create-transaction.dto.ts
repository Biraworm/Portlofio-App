import { IsString, IsNotEmpty, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsString()
  @IsNotEmpty()
  type: string; // "BUY" or "SELL"

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}

