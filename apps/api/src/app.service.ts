import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString(),
    };
  }

  getLive() {
    return this.getHealth();
  }

  getReady() {
    return this.getHealth();
  }
}
