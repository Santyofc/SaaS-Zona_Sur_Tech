import { Controller, Get, UseGuards } from '@nestjs/common';
import { ErpService } from './erp.service';
import { ActiveOrg } from '../../common/decorators/ctx.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { OrganizationAccessGuard } from '../auth/guards/organization-access.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('erp/dashboard')
@UseGuards(SupabaseAuthGuard, OrganizationAccessGuard)
export class DashboardController {
  constructor(private readonly erpService: ErpService) {}

  @Get('summary')
  @RequirePermission('erp:read')
  async getSummary(@ActiveOrg() organizationId: string) {
    return await this.erpService.getDashboardSummary(organizationId);
  }
}
