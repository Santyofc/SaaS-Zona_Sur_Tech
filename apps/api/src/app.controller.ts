import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('live')
  getLive() {
    return this.appService.getLive();
  }

  @Get('ready')
  async getReady() {
    return this.appService.getReady();
  }

  // Legacy endpoint for backwards compatibility with existing checks.
  @Get()
  async getHealth() {
    return this.appService.getReady();
  }
}
