import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAssetDto: CreateAssetDto) {
    const { ticker, name, type, currency } = createAssetDto;

    const existingAsset = await this.prisma.asset.findUnique({
      where: {
        userId_ticker: {
          userId,
          ticker: ticker.toUpperCase(),
        },
      },
    });

    if (existingAsset) {
      throw new ConflictException('Asset already exists for this user');
    }

    return this.prisma.asset.create({
      data: {
        userId,
        ticker: ticker.toUpperCase(),
        name,
        type,
        currency,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.asset.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            transactions: true,
            dividends: true,
          },
        },
      },
      orderBy: {
        ticker: 'asc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        transactions: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
        dividends: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  async remove(userId: string, id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return this.prisma.asset.delete({
      where: { id },
    });
  }
}
