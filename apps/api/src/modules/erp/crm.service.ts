import { Injectable, Inject } from '@nestjs/common';
import { crmLeads, crmOpportunities, withTenantContext } from '@repo/db';
import { eq } from 'drizzle-orm';

@Injectable()
export class CrmService {
  constructor(@Inject('DRIZZLE_DB') private readonly db: any) {}

  async getLeads(organizationId: string) {
    return await this.db
      .select()
      .from(crmLeads)
      .where(eq(crmLeads.organizationId, organizationId));
  }

  async createLead(organizationId: string, data: any) {
    return await withTenantContext(this.db, organizationId, async (tx: any) => {
      return await tx
        .insert(crmLeads)
        .values({
          organizationId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          source: data.source,
          status: 'new',
        })
        .returning();
    });
  }

  async getOpportunities(organizationId: string) {
    return await this.db
      .select()
      .from(crmOpportunities)
      .where(eq(crmOpportunities.organizationId, organizationId));
  }
}
