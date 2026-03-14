import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  inventoryMovements,
  inventoryBalances,
  sales,
  saleItems,
  products,
} from '@repo/db';
import { eq, and, sql, count, desc } from 'drizzle-orm';
import { InventoryAdjustmentDto, CreateSaleDto } from './dto/erp.dto';

@Injectable()
export class ErpService {
  constructor(@Inject('DRIZZLE_DB') private readonly db: any) {}

  // --- Inventory ---
  async getBalances(organizationId: string) {
    return await this.db
      .select({
        id: inventoryBalances.id,
        productId: inventoryBalances.productId,
        productName: products.name,
        sku: products.sku,
        currentQuantity: inventoryBalances.currentQuantity,
        updatedAt: inventoryBalances.updatedAt,
      })
      .from(inventoryBalances)
      .innerJoin(products, eq(inventoryBalances.productId, products.id))
      .where(eq(inventoryBalances.organizationId, organizationId));
  }

  async getMovements(organizationId: string) {
    return await this.db
      .select({
        id: inventoryMovements.id,
        organizationId: inventoryMovements.organizationId,
        productId: inventoryMovements.productId,
        productName: products.name,
        movementType: inventoryMovements.movementType,
        quantity: inventoryMovements.quantity,
        unitCost: inventoryMovements.unitCost,
        referenceType: inventoryMovements.referenceType,
        referenceId: inventoryMovements.referenceId,
        note: inventoryMovements.note,
        createdBy: inventoryMovements.createdBy,
        createdAt: inventoryMovements.createdAt,
      })
      .from(inventoryMovements)
      .innerJoin(products, eq(inventoryMovements.productId, products.id))
      .where(eq(inventoryMovements.organizationId, organizationId))
      .orderBy(sql`${inventoryMovements.createdAt} DESC`);
  }

  async adjustInventory(
    organizationId: string,
    userId: string,
    data: InventoryAdjustmentDto,
  ) {
    return await this.db.transaction(async (tx: any) => {
      // 1. Record movement
      await tx.insert(inventoryMovements).values({
        organizationId,
        productId: data.productId,
        movementType: data.movementType,
        quantity: data.quantity.toString(),
        createdBy: userId,
        note: data.note,
      });

      // 2. Update balance
      await tx
        .insert(inventoryBalances)
        .values({
          organizationId,
          productId: data.productId,
          currentQuantity: data.quantity.toString(),
        })
        .onConflictDoUpdate({
          target: [
            inventoryBalances.organizationId,
            inventoryBalances.productId,
          ],
          set: {
            currentQuantity: sql`${inventoryBalances.currentQuantity} + ${data.quantity.toString()}`,
            updatedAt: new Date(),
          },
        });

      return { success: true };
    });
  }

  // --- Sales ---
  async getSales(organizationId: string) {
    return await this.db
      .select()
      .from(sales)
      .where(eq(sales.organizationId, organizationId))
      .orderBy(sql`${sales.createdAt} DESC`);
  }

  async getSaleDetails(organizationId: string, saleId: string) {
    const sale = await this.db.query.sales.findFirst({
      where: and(
        eq(sales.id, saleId),
        eq(sales.organizationId, organizationId),
      ),
    });

    if (!sale) throw new NotFoundException('Sale not found');

    const items = await this.db
      .select({
        id: saleItems.id,
        productId: saleItems.productId,
        productName: products.name,
        quantity: saleItems.quantity,
        unitPrice: saleItems.unitPrice,
        total: saleItems.total,
      })
      .from(saleItems)
      .innerJoin(products, eq(saleItems.productId, products.id))
      .where(eq(saleItems.saleId, saleId));

    return { ...sale, items };
  }

  async createSale(
    organizationId: string,
    userId: string,
    data: CreateSaleDto,
  ) {
    return await this.db.transaction(async (tx: any) => {
      // Logic from createSaleAction
      let subtotal = 0;
      for (const item of data.items) {
        subtotal += item.quantity * item.unitPrice - (item.discountAmount || 0);
      }
      const total = subtotal - (data.discount || 0);
      const saleNumber = `SALE-API-${Date.now()}`;

      const [newSale] = await tx
        .insert(sales)
        .values({
          organizationId,
          saleNumber,
          status: 'completed',
          subtotal: subtotal.toString(),
          total: total.toString(),
          discount: (data.discount || 0).toString(),
          paymentMethod: data.paymentMethod,
          createdBy: userId,
        })
        .returning();

      for (const item of data.items) {
        // 3a. Check current stock with row-level locking
        const [balance] = await tx
          .select()
          .from(inventoryBalances)
          .where(
            and(
              eq(inventoryBalances.organizationId, organizationId),
              eq(inventoryBalances.productId, item.productId),
            ),
          )
          .for('update')
          .limit(1);

        const currentQty = balance ? parseFloat(balance.currentQuantity) : 0;
        if (currentQty < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${item.productId}. Available: ${currentQty}, Requested: ${item.quantity}`,
          );
        }

        // 3b. Record Sale Item
        await tx.insert(saleItems).values({
          saleId: newSale.id,
          productId: item.productId,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
          discountAmount: (item.discountAmount || 0).toString(),
          total: (
            item.quantity * item.unitPrice -
            (item.discountAmount || 0)
          ).toString(),
        });

        // 3c. Record Inventory Movement (OUT)
        await tx.insert(inventoryMovements).values({
          organizationId,
          productId: item.productId,
          movementType: 'sale_out',
          quantity: (-item.quantity).toString(),
          referenceType: 'sales',
          referenceId: newSale.id,
          createdBy: userId,
        });

        // 3d. Update Balance
        await tx
          .insert(inventoryBalances)
          .values({
            organizationId,
            productId: item.productId,
            currentQuantity: (-item.quantity).toString(),
          })
          .onConflictDoUpdate({
            target: [
              inventoryBalances.organizationId,
              inventoryBalances.productId,
            ],
            set: {
              currentQuantity: sql`${inventoryBalances.currentQuantity} - ${item.quantity.toString()}`,
              updatedAt: new Date(),
            },
          });
      }

      return newSale;
    });
  }

  async cancelSale(organizationId: string, userId: string, saleId: string) {
    return await this.db.transaction(async (tx: any) => {
      const sale = await tx.query.sales.findFirst({
        where: and(
          eq(sales.id, saleId),
          eq(sales.organizationId, organizationId),
        ),
      });

      if (!sale) throw new NotFoundException('Sale not found');
      if (sale.status === 'cancelled')
        throw new Error('Sale already cancelled');

      await tx
        .update(sales)
        .set({
          status: 'cancelled',
          cancelledBy: userId,
          cancelledAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(sales.id, saleId));

      const items = await tx
        .select()
        .from(saleItems)
        .where(eq(saleItems.saleId, saleId));

      for (const item of items) {
        await tx.insert(inventoryMovements).values({
          organizationId,
          productId: item.productId,
          movementType: 'sale_cancel_revert',
          quantity: item.quantity,
          referenceType: 'sales',
          referenceId: saleId,
          createdBy: userId,
        });

        await tx
          .update(inventoryBalances)
          .set({
            currentQuantity: sql`${inventoryBalances.currentQuantity} + ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(inventoryBalances.organizationId, organizationId),
              eq(inventoryBalances.productId, item.productId),
            ),
          );
      }

      return { success: true };
    });
  }

  // --- Dashboard / Analytics ---
  async getDashboardSummary(organizationId: string) {
    // 1. Total Products
    const [productCount] = await this.db
      .select({ value: count() })
      .from(products)
      .where(
        and(
          eq(products.organizationId, organizationId),
          eq(products.isActive, true),
        ),
      );

    // 2. Sales Summary (Last 30 days revenue and count)
    const [salesSummary] = await this.db
      .select({
        totalRevenue: sql<string>`coalesce(sum(${sales.total}), '0')`,
        salesCount: count(),
      })
      .from(sales)
      .where(
        and(
          eq(sales.organizationId, organizationId),
          eq(sales.status, 'completed'),
        ),
      );

    // 3. Low Stock Items (Quantity <= 5)
    const lowStockItems = await this.db
      .select({
        id: products.id,
        name: products.name,
        currentQuantity: inventoryBalances.currentQuantity,
      })
      .from(inventoryBalances)
      .innerJoin(products, eq(inventoryBalances.productId, products.id))
      .where(
        and(
          eq(inventoryBalances.organizationId, organizationId),
          sql`${inventoryBalances.currentQuantity} <= '5'`,
        ),
      )
      .limit(5);

    // 4. Recent Sales for Sparkline (Last 7 days)
    const recentSales = await this.db
      .select({
        date: sql<string>`date(${sales.createdAt})`,
        amount: sql<string>`sum(${sales.total})`,
      })
      .from(sales)
      .where(
        and(
          eq(sales.organizationId, organizationId),
          eq(sales.status, 'completed'),
        ),
      )
      .groupBy(sql`date(${sales.createdAt})`)
      .orderBy(desc(sql`date(${sales.createdAt})`))
      .limit(7);

    return {
      totalProducts: productCount.value,
      totalRevenue: salesSummary.totalRevenue,
      totalSales: salesSummary.salesCount,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      revenueHistory: recentSales,
    };
  }
}
