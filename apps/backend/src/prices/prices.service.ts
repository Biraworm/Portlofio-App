import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PricesService {
  constructor(private prisma: PrismaService) {}

  async syncPrices() {
    // Get all unique tickers from assets
    const assets = await this.prisma.asset.findMany({
      select: {
        ticker: true,
        id: true,
      },
      distinct: ['ticker'],
    });

    const syncedPrices = [];

    for (const asset of assets) {
      // In production, fetch real prices from external API
      // For now, we'll use a mock price
      const mockPrice = 100 * (1 + (Math.random() - 0.5) * 0.1); // Mock price around 100
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if price already exists for today
      const existingPrice = await this.prisma.price.findFirst({
        where: {
          assetId: asset.id,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });

      let priceRecord;
      if (existingPrice) {
        priceRecord = await this.prisma.price.update({
          where: { id: existingPrice.id },
          data: { close: mockPrice },
        });
      } else {
        priceRecord = await this.prisma.price.create({
          data: {
            assetId: asset.id,
            close: mockPrice,
            date: today,
          },
        });
      }

      syncedPrices.push({
        ticker: asset.ticker,
        price: priceRecord.close,
        date: priceRecord.date,
      });
    }

    return {
      synced: syncedPrices.length,
      prices: syncedPrices,
    };
  }

  async getPriceHistory(ticker: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Find asset by ticker
    const asset = await this.prisma.asset.findFirst({
      where: { ticker: ticker.toUpperCase() },
    });

    if (!asset) {
      return [];
    }

    return this.prisma.price.findMany({
      where: {
        assetId: asset.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}
