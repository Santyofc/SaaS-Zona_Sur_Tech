import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { OrganizationAccessGuard } from '../auth/guards/organization-access.guard';
import { InvoicingService } from './invoicing.service';
import { AccountingService } from './accounting.service';
import { CrmService } from './crm.service';

@Controller('erp')
@UseGuards(SupabaseAuthGuard, OrganizationAccessGuard)
export class ErpController {
  constructor(
    private readonly invoicingService: InvoicingService,
    private readonly accountingService: AccountingService,
    private readonly crmService: CrmService,
  ) {}

  @Post('invoices')
  async createInvoice(@Req() req: any, @Body() data: any) {
    return this.invoicingService.createInvoice(
      req.organizationId as string,
      req.user.userId as string,
      data,
    );
  }

  @Post('invoices/:id/pay')
  async payInvoice(@Req() req: any, @Param('id') id: string) {
    return this.invoicingService.markAsPaid(
      req.organizationId as string,
      id,
      req.user.userId as string,
    );
  }

  @Get('accounts')
  async getAccounts(@Req() req: any) {
    return this.accountingService.getChartOfAccounts(req.organizationId);
  }

  @Get('leads')
  async getLeads(@Req() req: any) {
    return this.crmService.getLeads(req.organizationId);
  }

  @Post('leads')
  async createLead(@Req() req: any, @Body() data: any) {
    return this.crmService.createLead(req.organizationId, data);
  }
}
