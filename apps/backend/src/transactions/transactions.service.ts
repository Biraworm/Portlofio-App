import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { ticker, type, quantity, price, date } = createTransactionDto;

    // Find or create asset
    let asset = await this.prisma.asset.findUnique({
      where: {
        userId_ticker: {
          userId,
          ticker: ticker.toUpperCase(),
        },
      },
    });

    if (!asset) {
      // Create asset if it doesn't exist
      asset = await this.prisma.asset.create({
        data: {
          userId,
          ticker: ticker.toUpperCase(),
          category: 'STOCK', // Default category
          quantity: 0,
          averagePrice: 0,
        },
      });
    }

    // Calculate new average price and quantity
    let newQuantity = asset.quantity;
    let newAveragePrice = asset.averagePrice;

    if (type === 'BUY') {
      const totalValue = asset.quantity * asset.averagePrice + quantity * price;
      newQuantity = asset.quantity + quantity;
      newAveragePrice = newQuantity > 0 ? totalValue / newQuantity : price;
    } else if (type === 'SELL') {
      if (asset.quantity < quantity) {
        throw new BadRequestException('Insufficient quantity to sell');
      }
      newQuantity = asset.quantity - quantity;
      newAveragePrice = asset.averagePrice; // Average price doesn't change on sell
    } else {
      throw new BadRequestException('Transaction type must be BUY or SELL');
    }

    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        assetId: asset.id,
        type,
        quantity,
        price,
        date: new Date(date),
      },
    });

    // Update asset
    await this.prisma.asset.update({
      where: { id: asset.id },
      data: {
        quantity: newQuantity,
        averagePrice: newAveragePrice,
      },
    });

    return transaction;
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        asset: {
          select: {
            ticker: true,
            category: true,
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

