import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  inventoryMovements,
  inventoryBalances,
  products,
  withTenantContext,
} from '@repo/db';
import { eq, sql } from 'drizzle-orm';
import { InventoryAdjustmentDto } from './dto/erp.dto';

@Injectable()
export class InventoryService {
  constructor(@Inject('DRIZZLE_DB') private readonly db: any) {}

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
    return await withTenantContext(this.db, organizationId, async (tx: any) => {
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
}
