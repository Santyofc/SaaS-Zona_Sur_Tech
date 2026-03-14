import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { ConfigModule } from '@nestjs/config';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { OrganizationAccessGuard } from './guards/organization-access.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'supabase' }),
    ConfigModule,
  ],
  providers: [SupabaseStrategy, SupabaseAuthGuard, OrganizationAccessGuard],
  exports: [
    PassportModule,
    SupabaseStrategy,
    SupabaseAuthGuard,
    OrganizationAccessGuard,
  ],
})
export class AuthModule {}
