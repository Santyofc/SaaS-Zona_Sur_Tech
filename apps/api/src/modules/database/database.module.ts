import { Module, Global, Provider } from '@nestjs/common';
import { db } from '@repo/db';
import { TenantContextService } from '../../common/services/tenant-context.service';

const DATABASE_PROVIDER: Provider = {
  provide: 'DRIZZLE_DB',
  useValue: db,
};

@Global()
@Module({
  providers: [DATABASE_PROVIDER, TenantContextService],
  exports: [DATABASE_PROVIDER, TenantContextService],
})
export class DatabaseModule {}
