import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  sales,
  saleItems,
  inventoryMovements,
  inventoryBalances,
  products,
  withTenantContext,
} from '@repo/db';
import { eq, and, sql } from 'drizzle-orm';
import { CreateSaleDto } from './dto/erp.dto';

@Injectable()
export class SalesService {
  constructor(@Inject('DRIZZLE_DB') private readonly db: any) {}

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
    return await withTenantContext(this.db, organizationId, async (tx: any) => {
      let subtotal = 0;
      for (const item of data.items) {
        subtotal += item.quantity * item.unitPrice - (item.discountAmount || 0);
      }
      const total = subtotal - (data.discount || 0);
      const saleNumber = `SALE-${Date.now()}`;

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
        // Check current stock with row-level locking
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

        // Record Sale Item
        await tx.insert(saleItems).values({
          organizationId,
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

        // Record Inventory Movement (OUT)
        await tx.insert(inventoryMovements).values({
          organizationId,
          productId: item.productId,
          movementType: 'out', // Standardized movement type
          quantity: (-item.quantity).toString(),
          referenceType: 'sales',
          referenceId: newSale.id,
          createdBy: userId,
        });

        // Update Balance
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
    return await withTenantContext(this.db, organizationId, async (tx: any) => {
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
          movementType: 'in', // Revert sale is an IN movement
          quantity: item.quantity,
          referenceType: 'sales',
          referenceId: saleId,
          createdBy: userId,
          note: `Reverted from cancelled sale ${sale.saleNumber}`
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
}
