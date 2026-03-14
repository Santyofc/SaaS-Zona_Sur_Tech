import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ErpService } from './erp.service';
import { InventoryAdjustmentDto } from './dto/erp.dto';
import { CurrentUser, ActiveOrg } from '../../common/decorators/ctx.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { OrganizationAccessGuard } from '../auth/guards/organization-access.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('erp/inventory')
@UseGuards(SupabaseAuthGuard, OrganizationAccessGuard)
export class InventoryController {
  constructor(private readonly erpService: ErpService) {}

  @Get('balances')
  @RequirePermission('erp:read')
  async getBalances(@ActiveOrg() organizationId: string) {
    return this.erpService.getBalances(organizationId);
  }

  @Get('movements')
  @RequirePermission('erp:read')
  async getMovements(@ActiveOrg() organizationId: string) {
    return this.erpService.getMovements(organizationId);
  }

  @Post('adjust')
  @RequirePermission('erp:write')
  async adjust(
    @ActiveOrg() organizationId: string,
    @CurrentUser() user: any,
    @Body() data: InventoryAdjustmentDto,
  ) {
    return this.erpService.adjustInventory(organizationId, user.userId, data);
  }
}
