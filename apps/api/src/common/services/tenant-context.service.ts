import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class TenantContextService {
  private static readonly storage = new AsyncLocalStorage<string>();

  /**
   * Runs the given callback within a tenant context.
   */
  run(organizationId: string, callback: () => void) {
    TenantContextService.storage.run(organizationId, callback);
  }

  /**
   * Gets the current organization ID from the context.
   */
  getOrganizationId(): string | undefined {
    return TenantContextService.storage.getStore();
  }
}
