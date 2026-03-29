import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          username: configService.get<string>('REDIS_USERNAME'),
        },
      }),
      inject: [ConfigService],
    }),
    // Register specific queues
    BullModule.registerQueue({
      name: 'erp_queue',
    }),
    BullModule.registerQueue({
      name: 'notification_queue',
    }),
    BullModule.registerQueue({
      name: 'ai_queue',
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
