import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PricesService {
  private readonly logger = new Logger(PricesService.name);
  private readonly finnhubApiKey: string;
  private readonly finnhubBaseUrl = 'https://finnhub.io/api/v1';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.finnhubApiKey = this.configService.get<string>('FINNHUB_API_KEY') || '';
    if (!this.finnhubApiKey) {
      this.logger.warn('FINNHUB_API_KEY not configured');
    }
  }

  async syncPrices(tickerList: string[]): Promise<{ synced: number; errors: number; details: any[] }> {
    this.logger.log(`Starting price sync for ${tickerList.length} tickers: ${tickerList.join(', ')}`);

    if (!this.finnhubApiKey) {
      throw new Error('FINNHUB_API_KEY is not configured');
    }

    const results = {
      synced: 0,
      errors: 0,
      details: [] as any[],
    };

    const endDate = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const startDate = endDate - (365 * 24 * 60 * 60); // 365 days ago

    for (let i = 0; i < tickerList.length; i++) {
      const ticker = tickerList[i].toUpperCase();
      this.logger.log(`[${i + 1}/${tickerList.length}] Processing ticker: ${ticker}`);

      try {
        // Find or create asset by ticker (we need at least one asset to link prices)
        // For now, we'll search for existing assets with this ticker
        const assets = await this.prisma.asset.findMany({
          where: { ticker },
          select: { id: true, ticker: true },
        });

        if (assets.length === 0) {
          this.logger.warn(`No assets found for ticker ${ticker}, skipping...`);
          results.errors++;
          results.details.push({
            ticker,
            status: 'skipped',
            reason: 'No asset found',
          });
          continue;
        }

        // Fetch historical prices from Finnhub
        const response = await axios.get(`${this.finnhubBaseUrl}/stock/candle`, {
          params: {
            symbol: ticker,
            resolution: 'D', // Daily
            from: startDate,
            to: endDate,
            token: this.finnhubApiKey,
          },
        });

        if (response.data.s !== 'ok') {
          this.logger.error(`Finnhub API error for ${ticker}: ${response.data.s}`);
          results.errors++;
          results.details.push({
            ticker,
            status: 'error',
            reason: `API error: ${response.data.s}`,
          });
          continue;
        }

        const { c: closes, t: timestamps } = response.data;

        if (!closes || !timestamps || closes.length === 0) {
          this.logger.warn(`No price data returned for ${ticker}`);
          results.errors++;
          results.details.push({
            ticker,
            status: 'error',
            reason: 'No data returned',
          });
          continue;
        }

        this.logger.log(`Fetched ${closes.length} price points for ${ticker}`);

        // Process prices for each asset with this ticker
        let pricesSaved = 0;
        for (const asset of assets) {
          // Use upsert to replace duplicates
          for (let j = 0; j < closes.length; j++) {
            const timestamp = timestamps[j];
            const close = closes[j];
            const date = new Date(timestamp * 1000); // Convert Unix timestamp to Date
            date.setHours(0, 0, 0, 0); // Normalize to midnight

            await this.prisma.price.upsert({
              where: {
                assetId_date: {
                  assetId: asset.id,
                  date,
                },
              },
              update: {
                close,
              },
              create: {
                assetId: asset.id,
                date,
                close,
              },
            });
            pricesSaved++;
          }
        }

        this.logger.log(`Saved ${pricesSaved} price records for ${ticker}`);
        results.synced++;
        results.details.push({
          ticker,
          status: 'success',
          pricesSaved,
          dateRange: {
            from: new Date(timestamps[0] * 1000).toISOString(),
            to: new Date(timestamps[timestamps.length - 1] * 1000).toISOString(),
          },
        });

        // Add a small delay to avoid rate limiting
        if (i < tickerList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        this.logger.error(`Error syncing prices for ${ticker}: ${error.message}`, error.stack);
        results.errors++;
        results.details.push({
          ticker,
          status: 'error',
          reason: error.message,
        });
      }
    }

    this.logger.log(`Price sync completed: ${results.synced} successful, ${results.errors} errors`);
    return results;
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
