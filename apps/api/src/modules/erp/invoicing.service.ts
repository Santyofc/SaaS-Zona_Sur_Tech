import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { invoices, invoiceItems, withTenantContext } from '@repo/db';
import { eq, and } from 'drizzle-orm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class InvoicingService {
  constructor(
    @Inject('DRIZZLE_DB') private readonly db: any,
    @InjectQueue('erp_queue') private readonly erpQueue: Queue,
  ) {}

  async createInvoice(organizationId: string, userId: string, data: any) {
    return await withTenantContext(this.db, organizationId, async (tx: any) => {
      // 1. Create Invoice record
      const [newInvoice] = await tx
        .insert(invoices)
        .values({
          organizationId,
          invoiceNumber: `INV-${Date.now()}`,
          status: 'draft',
          subtotal: data.subtotal.toString(),
          taxTotal: data.taxTotal.toString(),
          total: data.total.toString(),
          createdBy: userId,
        })
        .returning();

      // 2. Add items
      for (const item of data.items) {
        await tx.insert(invoiceItems).values({
          organizationId,
          invoiceId: newInvoice.id,
          productId: item.productId,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
          taxAmount: item.taxAmount.toString(),
          total: item.total.toString(),
        });
      }

      // 3. Queue PDF generation
      await this.erpQueue.add('generate_invoice_pdf', {
        invoiceId: newInvoice.id,
        organizationId,
      });

      return newInvoice;
    });
  }

  async markAsPaid(organizationId: string, invoiceId: string, userId: string) {
    return await withTenantContext(this.db, organizationId, async (tx: any) => {
      const [invoice] = await tx
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.id, invoiceId),
            eq(invoices.organizationId, organizationId),
          ),
        )
        .for('update');

      if (!invoice) throw new NotFoundException('Invoice not found');
      if (invoice.status === 'paid') return invoice;

      // Update status
      await tx
        .update(invoices)
        .set({
          status: 'paid',
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, invoiceId));

      return { success: true };
    });
  }
}
