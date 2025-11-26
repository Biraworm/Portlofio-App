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
      // For now, we'll use a mock price based on average price
      const assetData = await this.prisma.asset.findFirst({
        where: { ticker: asset.ticker },
        orderBy: { updatedAt: 'desc' },
      });

      if (assetData) {
        // Mock price: use average price with some random variation
        const mockPrice = assetData.averagePrice * (1 + (Math.random() - 0.5) * 0.1);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if price already exists for today
        const existingPrice = await this.prisma.priceHistory.findFirst({
          where: {
            assetId: asset.id,
            date: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        });

        let priceHistory;
        if (existingPrice) {
          priceHistory = await this.prisma.priceHistory.update({
            where: { id: existingPrice.id },
            data: { price: mockPrice },
          });
        } else {
          priceHistory = await this.prisma.priceHistory.create({
            data: {
              assetId: asset.id,
              ticker: asset.ticker,
              price: mockPrice,
              date: today,
            },
          });
        }

        syncedPrices.push({
          ticker: asset.ticker,
          price: priceHistory.price,
          date: priceHistory.date,
        });
      }
    }

    return {
      synced: syncedPrices.length,
      prices: syncedPrices,
    };
  }

  async getPriceHistory(ticker: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.priceHistory.findMany({
      where: {
        ticker: ticker.toUpperCase(),
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

