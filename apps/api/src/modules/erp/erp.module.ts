import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { InventoryController } from './inventory.controller';
import { SalesController } from './sales.controller';
import { DashboardController } from './dashboard.controller';
import { ErpService } from './erp.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    ProductsController,
    InventoryController,
    SalesController,
    DashboardController,
  ],
  providers: [ProductsService, ErpService],
})
export class ErpModule {}
