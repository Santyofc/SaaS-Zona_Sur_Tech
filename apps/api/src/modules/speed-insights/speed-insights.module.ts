import { Module } from '@nestjs/common';
import { SpeedInsightsService } from './speed-insights.service';

/**
 * Speed Insights Module
 *
 * This module provides Vercel Speed Insights integration for the API.
 * Note: Speed Insights is primarily designed for frontend applications to track
 * Core Web Vitals. This module provides a service layer that could be used if:
 * - The API needs to serve HTML with Speed Insights tracking
 * - Custom analytics endpoints need to be created
 * - Integration with a frontend application is required
 */
@Module({
  providers: [SpeedInsightsService],
  exports: [SpeedInsightsService],
})
export class SpeedInsightsModule {}
