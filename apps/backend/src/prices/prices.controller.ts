import { Controller, Post, Get, Param, Query, UseGuards, Body } from '@nestjs/common';
import { PricesService } from './prices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { SyncPricesDto } from './dto/sync-prices.dto';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post('prices')
  @UseGuards(AdminGuard)
  async syncPrices(@Body() syncPricesDto: SyncPricesDto) {
    return this.pricesService.syncPrices(syncPricesDto.tickers);
  }

  @Get('prices/:ticker')
  getPriceHistory(@Param('ticker') ticker: string, @Query('days') days?: string) {
    return this.pricesService.getPriceHistory(ticker, days ? parseInt(days) : 30);
  }
}
