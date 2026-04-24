import { Injectable, Logger } from '@nestjs/common';

/**
 * Speed Insights Service
 *
 * Service for managing Vercel Speed Insights integration.
 *
 * @remarks
 * Speed Insights is designed for frontend applications to track Core Web Vitals.
 * This service provides utility methods that can be used if the API needs to:
 * - Generate Speed Insights script tags for HTML responses
 * - Provide configuration for frontend clients
 * - Integrate with custom analytics endpoints
 *
 * @example
 * ```typescript
 * // In a controller that serves HTML
 * const scriptTag = this.speedInsightsService.getScriptTag();
 * // Include scriptTag in your HTML response
 * ```
 */
@Injectable()
export class SpeedInsightsService {
  private readonly logger = new Logger(SpeedInsightsService.name);

  constructor() {
    this.logger.log('Speed Insights Service initialized');
  }

  /**
   * Get the Speed Insights script tag for injection into HTML
   *
   * @returns HTML script tag string for Speed Insights
   *
   * @remarks
   * Use this method if you're serving HTML from the API and want to include
   * Speed Insights tracking. For a pure REST API, Speed Insights is typically
   * integrated on the frontend application instead.
   */
  getScriptTag(): string {
    return `<script>window.si=window.si||function(){(window.siq=window.siq||[]).push(arguments);};</script><script defer src="/_vercel/speed-insights/script.js"></script>`;
  }

  /**
   * Get the configuration object for Speed Insights
   *
   * @returns Configuration object that can be sent to frontend clients
   *
   * @remarks
   * Use this method to provide Speed Insights configuration to your frontend
   * through an API endpoint.
   */
  getConfig(): { enabled: boolean; route: string } {
    return {
      enabled: true,
      route: '/_vercel/speed-insights/script.js',
    };
  }

  /**
   * Check if Speed Insights is available
   *
   * @returns boolean indicating if Speed Insights package is available
   */
  isAvailable(): boolean {
    try {
      // Using dynamic import check for package availability
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('@vercel/speed-insights');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Log Speed Insights status
   *
   * @remarks
   * Useful for debugging and verifying the integration
   */
  logStatus(): void {
    const available = this.isAvailable();
    this.logger.log(`Speed Insights package available: ${available}`);
    if (!available) {
      this.logger.warn(
        'Speed Insights package not found. Run: pnpm add @vercel/speed-insights',
      );
    }
  }
}
