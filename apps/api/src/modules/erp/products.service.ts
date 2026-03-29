import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { products, inventoryMovements, inventoryBalances, withTenantContext } from '@repo/db';
import { eq, and, sql } from 'drizzle-orm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(@Inject('DRIZZLE_DB') private readonly db: any) {}

  async findAll(organizationId: string) {
    return await this.db
      .select()
      .from(products)
      .where(eq(products.organizationId, organizationId))
      .orderBy(sql`${products.name} ASC`);
  }

  async create(organizationId: string, userId: string, data: CreateProductDto) {
    const { initialStock, ...productData } = data;

    return await withTenantContext(this.db, organizationId, async (tx: any) => {
      // 1. Create product
      const [newProduct] = await tx
        .insert(products)
        .values({
          organizationId,
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          salePrice: productData.salePrice.toString(),
          costPrice: productData.costPrice.toString(),
          isActive: productData.isActive ?? true,
          createdBy: userId,
        })
        .returning();

      // 2. Initial stock if provided
      if (initialStock && initialStock !== 0) {
        await tx.insert(inventoryMovements).values({
          organizationId,
          productId: newProduct.id,
          movementType: 'initial_stock',
          quantity: initialStock.toString(),
          unitCost: productData.costPrice.toString(),
          createdBy: userId,
          note: 'Initial stock on creation (API)',
        });

        await tx.insert(inventoryBalances).values({
          organizationId,
          productId: newProduct.id,
          currentQuantity: initialStock.toString(),
        });
      }

      return newProduct;
    });
  }

  async update(
    organizationId: string,
    userId: string,
    id: string,
    data: UpdateProductDto,
  ) {
    const [updatedProduct] = await this.db
      .update(products)
      .set({
        ...data,
        salePrice: data.salePrice?.toString(),
        costPrice: data.costPrice?.toString(),
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(
        and(eq(products.id, id), eq(products.organizationId, organizationId)),
      )
      .returning();

    if (!updatedProduct)
      throw new NotFoundException('Product not found or access denied');
    return updatedProduct;
  }
}
