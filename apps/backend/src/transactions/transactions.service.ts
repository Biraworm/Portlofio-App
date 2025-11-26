import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { ticker, type, quantity, price, fees = 0, date } = createTransactionDto;

    // Find asset - must exist
    const asset = await this.prisma.asset.findUnique({
      where: {
        userId_ticker: {
          userId,
          ticker: ticker.toUpperCase(),
        },
      },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found. Please create the asset first.');
    }

    // Validate SELL transactions - check if user has enough quantity
    if (type === 'SELL') {
      const currentQuantity = await this.calculateCurrentQuantity(asset.id);
      if (currentQuantity < quantity) {
        throw new BadRequestException('Insufficient quantity to sell');
      }
    } else if (type !== 'BUY') {
      throw new BadRequestException('Transaction type must be BUY or SELL');
    }

    // Create transaction
    return this.prisma.transaction.create({
      data: {
        userId,
        assetId: asset.id,
        type,
        quantity,
        price,
        fees,
        date: new Date(date),
      },
    });
  }

  private async calculateCurrentQuantity(assetId: string): Promise<number> {
    const transactions = await this.prisma.transaction.findMany({
      where: { assetId },
      orderBy: { date: 'asc' },
    });

    let quantity = 0;
    for (const transaction of transactions) {
      if (transaction.type === 'BUY') {
        quantity += transaction.quantity;
      } else if (transaction.type === 'SELL') {
        quantity -= transaction.quantity;
      }
    }

    return quantity;
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        asset: {
          select: {
            ticker: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        asset: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
