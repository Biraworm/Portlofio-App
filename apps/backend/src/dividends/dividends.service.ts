import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDividendDto } from './dto/create-dividend.dto';

@Injectable()
export class DividendsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDividendDto: CreateDividendDto) {
    const { ticker, amount, type, date } = createDividendDto;

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

    return this.prisma.dividend.create({
      data: {
        userId,
        assetId: asset.id,
        amount,
        type,
        date: new Date(date),
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.dividend.findMany({
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
    const dividend = await this.prisma.dividend.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        asset: true,
      },
    });

    if (!dividend) {
      throw new NotFoundException('Dividend not found');
    }

    return dividend;
  }
}

