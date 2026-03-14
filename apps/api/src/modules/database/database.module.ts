import { Module, Global, Provider } from '@nestjs/common';
import { db } from '@repo/db';

const DATABASE_PROVIDER: Provider = {
  provide: 'DRIZZLE_DB',
  useValue: db,
};

@Global()
@Module({
  providers: [DATABASE_PROVIDER],
  exports: [DATABASE_PROVIDER],
})
export class DatabaseModule {}
