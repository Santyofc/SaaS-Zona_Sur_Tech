import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ErpService } from './erp.service';
import { ProductsService } from './products.service';
import { InvoicingService } from './invoicing.service';
import { AccountingService } from './accounting.service';
import { CrmService } from './crm.service';
import { InventoryService } from './inventory.service';
import { SalesService } from './sales.service';
import { ErpProcessor } from './erp.processor';
import { AiProcessor } from './ai.processor';
import { ErpController } from './erp.controller';
import { ProductsController } from './products.controller';
import { SalesController } from './sales.controller';
import { InventoryController } from './inventory.controller';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'erp_queue' }, { name: 'ai_queue' }),
  ],
  providers: [
    ErpService,
    ProductsService,
    InvoicingService,
    AccountingService,
    CrmService,
    InventoryService,
    SalesService,
    ErpProcessor,
    AiProcessor,
  ],
  controllers: [
    ErpController,
    ProductsController,
    SalesController,
    InventoryController,
    DashboardController,
  ],
  exports: [ErpService],
})
export class ErpModule {}
