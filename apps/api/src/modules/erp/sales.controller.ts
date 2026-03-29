import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/erp.dto';
import { CurrentUser, ActiveOrg } from '../../common/decorators/ctx.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { OrganizationAccessGuard } from '../auth/guards/organization-access.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('erp/sales')
@UseGuards(SupabaseAuthGuard, OrganizationAccessGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @RequirePermission('erp:read')
  async getSales(@ActiveOrg() organizationId: string) {
    return this.salesService.getSales(organizationId);
  }

  @Get(':id')
  @RequirePermission('erp:read')
  async getSaleDetails(
    @ActiveOrg() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.salesService.getSaleDetails(organizationId, id);
  }

  @Post()
  @RequirePermission('erp:sales')
  async createSale(
    @ActiveOrg() organizationId: string,
    @CurrentUser() user: any,
    @Body() data: CreateSaleDto,
  ) {
    return this.salesService.createSale(organizationId, user.userId, data);
  }

  @Post(':id/cancel')
  @RequirePermission('erp:sales')
  async cancelSale(
    @ActiveOrg() organizationId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.salesService.cancelSale(organizationId, user.userId, id);
  }
}
