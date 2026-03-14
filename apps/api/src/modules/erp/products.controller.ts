import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CurrentUser, ActiveOrg } from '../../common/decorators/ctx.decorator';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { OrganizationAccessGuard } from '../auth/guards/organization-access.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('erp/products')
@UseGuards(SupabaseAuthGuard, OrganizationAccessGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @RequirePermission('erp:read')
  async findAll(@ActiveOrg() organizationId: string) {
    return this.productsService.findAll(organizationId);
  }

  @Post()
  @RequirePermission('erp:write')
  async create(
    @ActiveOrg() organizationId: string,
    @CurrentUser() user: any,
    @Body() data: CreateProductDto,
  ) {
    return this.productsService.create(organizationId, user.userId, data);
  }

  @Patch(':id')
  @RequirePermission('erp:write')
  async update(
    @ActiveOrg() organizationId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ) {
    return this.productsService.update(organizationId, user.userId, id, data);
  }
}
