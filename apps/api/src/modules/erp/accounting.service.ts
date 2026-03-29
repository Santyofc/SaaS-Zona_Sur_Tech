import { Injectable, Inject } from '@nestjs/common';
import { accounts, journalEntries, journalItems, withTenantContext } from '@repo/db';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class AccountingService {
  constructor(@Inject('DRIZZLE_DB') private readonly db: any) {}

  async getChartOfAccounts(organizationId: string) {
    return await this.db
      .select()
      .from(accounts)
      .where(eq(accounts.organizationId, organizationId));
  }

  async createJournalEntry(
    organizationId: string,
    data: {
      description: string;
      referenceType: string;
      referenceId: string;
      entries: { accountId: string; debit: number; credit: number }[];
    },
  ) {
    return await withTenantContext(this.db, organizationId, async (tx: any) => {
      // 1. Create Journal Entry (Header)
      const [entry] = await tx
        .insert(journalEntries)
        .values({
          organizationId,
          description: data.description,
          documentReference: `${data.referenceType}:${data.referenceId}`,
        })
        .returning();

      for (const item of data.entries) {
        // 2. Create Journal Items (Lines)
        await tx.insert(journalItems).values({
          organizationId,
          entryId: entry.id,
          accountId: item.accountId,
          debit: item.debit.toString(),
          credit: item.credit.toString(),
        });

        // 3. Update account total balance (Locking required)
        await tx
          .update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${item.debit.toString()} - ${item.credit.toString()}`,
            updatedAt: new Date(),
          })
          .where(eq(accounts.id, item.accountId));
      }

      return { success: true };
    });
  }
}
