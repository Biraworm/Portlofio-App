import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getPortfolio(userId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: {
            date: 'desc',
          },
        },
        dividends: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    // Calculate portfolio metrics
    let totalValue = 0;
    let totalCost = 0;
    const composition: Record<string, number> = {};

    for (const asset of assets) {
      // Get latest price from price history or use average price as fallback
      const latestPrice = await this.getLatestPrice(asset.ticker) || asset.averagePrice;
      const assetValue = asset.quantity * latestPrice;
      const assetCost = asset.quantity * asset.averagePrice;

      totalValue += assetValue;
      totalCost += assetCost;

      // Group by category
      if (!composition[asset.category]) {
        composition[asset.category] = 0;
      }
      composition[asset.category] += assetValue;
    }

    const totalProfit = totalValue - totalCost;
    const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    // Format composition as array
    const compositionArray = Object.entries(composition).map(([category, value]) => ({
      category,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));

    return {
      totalValue,
      totalCost,
      totalProfit,
      profitPercent,
      composition: compositionArray,
      assets: assets.map((asset) => ({
        ...asset,
        currentPrice: this.getLatestPrice(asset.ticker) || asset.averagePrice,
      })),
    };
  }

  private async getLatestPrice(ticker: string): Promise<number | null> {
    const latestPrice = await this.prisma.priceHistory.findFirst({
      where: { ticker: ticker.toUpperCase() },
      orderBy: { date: 'desc' },
    });

    return latestPrice ? latestPrice.price : null;
  }

  async compareWithIndex(userId: string, index: string = 'SPX') {
    const portfolio = await this.getPortfolio(userId);
    
    // Get portfolio historical data (simplified - using current value as baseline)
    const portfolioHistory = await this.getPortfolioHistory(userId);
    
    // Get index historical data (mock data for now - in production, fetch from external API)
    const indexHistory = await this.getIndexHistory(index);

    return {
      portfolio: portfolioHistory,
      index: indexHistory,
      comparison: this.calculateComparison(portfolioHistory, indexHistory),
    };
  }

  private async getPortfolioHistory(userId: string) {
    // Simplified: return last 30 days of portfolio value
    // In production, calculate from transactions and price history
    const assets = await this.prisma.asset.findMany({
      where: { userId },
    });

    const history = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      let value = 0;
      for (const asset of assets) {
        const priceHistory = await this.prisma.priceHistory.findFirst({
          where: {
            ticker: asset.ticker,
            date: {
              lte: date,
            },
          },
          orderBy: { date: 'desc' },
        });
        const price = priceHistory?.price || asset.averagePrice;
        value += asset.quantity * price;
      }
      
      history.push({
        date: date.toISOString().split('T')[0],
        value,
      });
    }

    return history;
  }

  private async getIndexHistory(index: string) {
    // Mock data - in production, fetch from external API (e.g., Alpha Vantage, Yahoo Finance)
    const history = [];
    const today = new Date();
    const baseValue = index === 'SPX' ? 4500 : 1000;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate some variation
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const value = baseValue * (1 + variation);
      
      history.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100,
      });
    }

    return history;
  }

  private calculateComparison(portfolio: any[], index: any[]) {
    if (portfolio.length === 0 || index.length === 0) {
      return { correlation: 0, portfolioReturn: 0, indexReturn: 0 };
    }

    const portfolioStart = portfolio[0].value;
    const portfolioEnd = portfolio[portfolio.length - 1].value;
    const portfolioReturn = portfolioStart > 0 ? ((portfolioEnd - portfolioStart) / portfolioStart) * 100 : 0;

    const indexStart = index[0].value;
    const indexEnd = index[index.length - 1].value;
    const indexReturn = indexStart > 0 ? ((indexEnd - indexStart) / indexStart) * 100 : 0;

    return {
      portfolioReturn,
      indexReturn,
      outperformance: portfolioReturn - indexReturn,
    };
  }
}

