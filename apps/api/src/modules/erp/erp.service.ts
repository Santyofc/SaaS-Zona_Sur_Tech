import { Injectable, Inject } from '@nestjs/common';
import {
  sales,
  inventoryBalances,
  products,
} from '@repo/db';
import { eq, and, sql, count, desc } from 'drizzle-orm';

@Injectable()
export class ErpService {
  constructor(@Inject('DRIZZLE_DB') private readonly db: any) {}

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
