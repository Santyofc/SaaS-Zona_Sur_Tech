import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryAdjustmentDto } from './dto/erp.dto';
import { CurrentUser, ActiveOrg } from '../../common/decorators/ctx.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { OrganizationAccessGuard } from '../auth/guards/organization-access.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('erp/inventory')
@UseGuards(SupabaseAuthGuard, OrganizationAccessGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('balances')
  @RequirePermission('erp:read')
  async getBalances(@ActiveOrg() organizationId: string) {
    return this.inventoryService.getBalances(organizationId);
  }

  @Get('movements')
  @RequirePermission('erp:read')
  async getMovements(@ActiveOrg() organizationId: string) {
    return this.inventoryService.getMovements(organizationId);
  }

  @Post('adjust')
  @RequirePermission('erp:write')
  async adjust(
    @ActiveOrg() organizationId: string,
    @CurrentUser() user: any,
    @Body() data: InventoryAdjustmentDto,
  ) {
    return this.inventoryService.adjustInventory(organizationId, user.userId, data);
  }
}
