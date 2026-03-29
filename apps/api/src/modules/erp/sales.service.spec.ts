import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { NotFoundException } from '@nestjs/common';
import * as dbLib from '@repo/db';

// Mock withTenantContext directly
jest.mock('@repo/db', () => ({
  ...jest.requireActual('@repo/db'),
  withTenantContext: jest.fn(),
}));

describe('SalesService', () => {
  let service: SalesService;
  let mockDb: any;
  const { withTenantContext } = dbLib as any;

  beforeEach(async () => {
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      for: jest.fn().mockReturnThis(),
      query: {
        sales: {
          findFirst: jest.fn(),
        },
      },
      execute: jest.fn(),
    };

    // Re-implementation of withTenantContext mock to pass through the mockDb
    withTenantContext.mockImplementation(async (db: any, orgId: string, cb: any) => cb(mockDb));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: 'DRIZZLE_DB',
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSale', () => {
    it('should throw error if insufficient stock', async () => {
      const orgId = 'test-org';
      const userId = 'user-1';
      const saleData = {
        items: [{ productId: 'prod-1', quantity: 10, unitPrice: 100 }],
        paymentMethod: 'cash',
      };

      // Mock stock check to return 5 units
      mockDb.select.mockReturnValueOnce([{ currentQuantity: '5' }]);

      await expect(service.createSale(orgId, userId, saleData as any)).rejects.toThrow(
        /Insufficient stock/,
      );
    });

    it('should succeed and return new sale if stock is sufficient', async () => {
      const orgId = 'test-org';
      const userId = 'user-1';
      const saleData = {
        items: [{ productId: 'prod-1', quantity: 2, unitPrice: 100 }],
        paymentMethod: 'cash',
      };

      // Mock stock check
      mockDb.select.mockReturnValueOnce([{ currentQuantity: '10' }]);
      // Mock sale return
      mockDb.returning.mockReturnValueOnce([{ id: 'sale-1', total: '200' }]);

      const result = await service.createSale(orgId, userId, saleData as any);
      expect(result.id).toBe('sale-1');
      expect(withTenantContext).toHaveBeenCalledWith(mockDb, orgId, expect.any(Function));
    });
  });
});
