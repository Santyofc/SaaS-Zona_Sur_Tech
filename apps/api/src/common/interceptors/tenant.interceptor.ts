import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from '../services/tenant-context.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly tenantContext: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.organizationId;

    if (!organizationId) {
      return next.handle();
    }

    // Wrap the request execution in the tenant context
    return new Observable((subscriber) => {
      this.tenantContext.run(organizationId as string, () => {
        next.handle().subscribe(subscriber);
      });
    });
  }
}
