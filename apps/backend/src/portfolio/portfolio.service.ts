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
      // Calculate quantity and average price from transactions
      const { quantity, averagePrice } = await this.calculateAssetMetrics(asset.id);
      
      // Get latest price from Price table
      const latestPrice = await this.getLatestPrice(asset.id);
      const currentPrice = latestPrice || averagePrice || 0;
      
      const assetValue = quantity * currentPrice;
      const assetCost = quantity * (averagePrice || 0);

      totalValue += assetValue;
      totalCost += assetCost;

      // Group by type
      if (!composition[asset.type]) {
        composition[asset.type] = 0;
      }
      composition[asset.type] += assetValue;
    }

    const totalProfit = totalValue - totalCost;
    const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    // Format composition as array
    const compositionArray = Object.entries(composition).map(([type, value]) => ({
      type,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));

    // Calculate metrics for each asset
    const assetsWithMetrics = await Promise.all(
      assets.map(async (asset) => {
        const { quantity, averagePrice } = await this.calculateAssetMetrics(asset.id);
        const latestPrice = await this.getLatestPrice(asset.id);
        const currentPrice = latestPrice || averagePrice || 0;
        const totalValue = quantity * currentPrice;
        const totalCost = quantity * (averagePrice || 0);
        const profit = totalValue - totalCost;
        const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;

        return {
          ...asset,
          quantity,
          averagePrice,
          currentPrice,
          totalValue,
          totalCost,
          profit,
          profitPercent,
        };
      })
    );

    return {
      totalValue,
      totalCost,
      totalProfit,
      profitPercent,
      composition: compositionArray,
      assets: assetsWithMetrics,
    };
  }

  private async calculateAssetMetrics(assetId: string): Promise<{ quantity: number; averagePrice: number }> {
    const transactions = await this.prisma.transaction.findMany({
      where: { assetId },
      orderBy: { date: 'asc' },
    });

    let quantity = 0;
    let totalCost = 0;

    for (const transaction of transactions) {
      if (transaction.type === 'BUY') {
        const cost = transaction.quantity * transaction.price + (transaction.fees || 0);
        totalCost += cost;
        quantity += transaction.quantity;
      } else if (transaction.type === 'SELL') {
        // For SELL, reduce quantity but maintain average price (FIFO-like)
        quantity -= transaction.quantity;
        // Adjust total cost proportionally
        if (quantity > 0) {
          const avgPrice = totalCost / (quantity + transaction.quantity);
          totalCost = quantity * avgPrice;
        } else {
          totalCost = 0;
        }
      }
    }

    const averagePrice = quantity > 0 ? totalCost / quantity : 0;

    return { quantity, averagePrice };
  }

  private async getLatestPrice(assetId: string): Promise<number | null> {
    const latestPrice = await this.prisma.price.findFirst({
      where: { assetId },
      orderBy: { date: 'desc' },
    });

    return latestPrice ? latestPrice.close : null;
  }

  async compareWithIndex(userId: string, index: string = 'SPX') {
    const portfolio = await this.getPortfolio(userId);
    
    // Get portfolio historical data
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
    const assets = await this.prisma.asset.findMany({
      where: { userId },
      include: {
        transactions: true,
      },
    });

    const history = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      let value = 0;
      for (const asset of assets) {
        // Get price for this date
        const priceRecord = await this.prisma.price.findFirst({
          where: {
            assetId: asset.id,
            date: {
              lte: date,
            },
          },
          orderBy: { date: 'desc' },
        });

        // Calculate quantity up to this date
        const transactionsUpToDate = asset.transactions.filter(t => new Date(t.date) <= date);
        let quantity = 0;
        for (const transaction of transactionsUpToDate) {
          if (transaction.type === 'BUY') {
            quantity += transaction.quantity;
          } else if (transaction.type === 'SELL') {
            quantity -= transaction.quantity;
          }
        }

        const price = priceRecord?.close || 0;
        value += quantity * price;
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
