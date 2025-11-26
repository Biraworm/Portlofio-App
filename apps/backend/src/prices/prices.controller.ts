import { Controller, Post, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PricesService } from './prices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post('prices')
  syncPrices() {
    return this.pricesService.syncPrices();
  }

  @Get('prices/:ticker')
  getPriceHistory(@Param('ticker') ticker: string, @Query('days') days?: string) {
    return this.pricesService.getPriceHistory(ticker, days ? parseInt(days) : 30);
  }
}

