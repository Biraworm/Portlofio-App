import { Test, TestingModule } from '@nestjs/testing';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('AssetsController', () => {
  let controller: AssetsController;
  let service: AssetsService;

  const mockPrismaService = {
    asset: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockAssetsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        {
          provide: AssetsService,
          useValue: mockAssetsService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AssetsController>(AssetsController);
    service = module.get<AssetsService>(AssetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an asset', async () => {
      const createAssetDto = {
        ticker: 'AAPL',
        name: 'Apple Inc.',
        type: 'STOCK',
        currency: 'USD',
      };
      const user = { userId: 'user123' };
      const expectedAsset = {
        id: 'asset123',
        ...createAssetDto,
        userId: user.userId,
      };

      mockAssetsService.create.mockResolvedValue(expectedAsset);

      const result = await controller.create(user, createAssetDto);

      expect(service.create).toHaveBeenCalledWith(user.userId, createAssetDto);
      expect(result).toEqual(expectedAsset);
    });
  });

  describe('findAll', () => {
    it('should return an array of assets', async () => {
      const user = { userId: 'user123' };
      const expectedAssets = [
        {
          id: 'asset1',
          ticker: 'AAPL',
          name: 'Apple Inc.',
          type: 'STOCK',
          currency: 'USD',
        },
        {
          id: 'asset2',
          ticker: 'GOOGL',
          name: 'Alphabet Inc.',
          type: 'STOCK',
          currency: 'USD',
        },
      ];

      mockAssetsService.findAll.mockResolvedValue(expectedAssets);

      const result = await controller.findAll(user);

      expect(service.findAll).toHaveBeenCalledWith(user.userId);
      expect(result).toEqual(expectedAssets);
    });
  });

  describe('findOne', () => {
    it('should return a single asset', async () => {
      const user = { userId: 'user123' };
      const assetId = 'asset123';
      const expectedAsset = {
        id: assetId,
        ticker: 'AAPL',
        name: 'Apple Inc.',
        type: 'STOCK',
        currency: 'USD',
      };

      mockAssetsService.findOne.mockResolvedValue(expectedAsset);

      const result = await controller.findOne(user, assetId);

      expect(service.findOne).toHaveBeenCalledWith(user.userId, assetId);
      expect(result).toEqual(expectedAsset);
    });
  });

  describe('remove', () => {
    it('should delete an asset', async () => {
      const user = { userId: 'user123' };
      const assetId = 'asset123';
      const deletedAsset = {
        id: assetId,
        ticker: 'AAPL',
      };

      mockAssetsService.remove.mockResolvedValue(deletedAsset);

      const result = await controller.remove(user, assetId);

      expect(service.remove).toHaveBeenCalledWith(user.userId, assetId);
      expect(result).toEqual(deletedAsset);
    });
  });
});


