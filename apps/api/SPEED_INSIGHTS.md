# Vercel Speed Insights Integration

This API has been configured with Vercel Speed Insights support.

## Important Notes

**Speed Insights is designed for frontend applications** to track Core Web Vitals (client-side performance metrics like First Contentful Paint, Largest Contentful Paint, etc.). Since this is a NestJS backend API, the integration provides utility services that can be used in specific scenarios:

## When to Use This Integration

1. **HTML Serving**: If your API serves HTML pages (SSR, templates, etc.), you can inject the Speed Insights script
2. **Frontend Configuration**: Provide Speed Insights configuration to frontend clients via API endpoints
3. **Custom Analytics**: Build custom analytics endpoints that interact with Speed Insights data
4. **Monorepo Setup**: Share Speed Insights configuration between API and frontend in the same repository

## Installation

The package has been installed:
```bash
pnpm add @vercel/speed-insights
```

## Configuration

### Module Integration

The `SpeedInsightsModule` has been added to `AppModule`:

```typescript
import { SpeedInsightsModule } from './modules/speed-insights/speed-insights.module';

@Module({
  imports: [
    // ... other modules
    SpeedInsightsModule,
  ],
})
export class AppModule {}
```

### Using the Service

Inject the service in your controllers or other services:

```typescript
import { Controller, Get } from '@nestjs/common';
import { SpeedInsightsService } from './modules/speed-insights/speed-insights.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly speedInsightsService: SpeedInsightsService) {}

  @Get('analytics')
  getAnalyticsConfig() {
    return this.speedInsightsService.getConfig();
  }
}
```

### Example: Serving HTML with Speed Insights

If you need to serve HTML from your API:

```typescript
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SpeedInsightsService } from './modules/speed-insights/speed-insights.service';

@Controller()
export class HtmlController {
  constructor(private readonly speedInsightsService: SpeedInsightsService) {}

  @Get('page')
  servePage(@Res() res: Response) {
    const scriptTag = this.speedInsightsService.getScriptTag();
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Page</title>
        </head>
        <body>
          <h1>Hello World</h1>
          ${scriptTag}
        </body>
      </html>
    `;
    
    res.type('html').send(html);
  }
}
```

## For Frontend Applications

If you have a separate frontend application (e.g., in `apps/web`), you should install Speed Insights there instead:

### Next.js (Recommended)
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### React
```typescript
// App.tsx
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <div>
      {/* Your app content */}
      <SpeedInsights />
    </div>
  );
}
```

## Available Methods

### `getScriptTag(): string`
Returns the HTML script tag for Speed Insights injection.

### `getConfig(): object`
Returns configuration object for Speed Insights.

### `isAvailable(): boolean`
Checks if the Speed Insights package is properly installed.

### `logStatus(): void`
Logs the current status of Speed Insights integration.

## Vercel Dashboard Configuration

To enable Speed Insights on Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Speed Insights from the sidebar
4. Click "Enable" to activate Speed Insights
5. Deploy your application

After deployment, Speed Insights will track performance metrics at `/_vercel/speed-insights/*` routes.

## Testing

Run the unit tests:
```bash
pnpm test speed-insights.service.spec.ts
```

## Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart)
- [Core Web Vitals](https://web.dev/vitals/)

## Notes for This Project

Since this is primarily a REST API backend, you may want to:

1. **Install in Frontend**: If you have a frontend app in this monorepo (e.g., `apps/web`), install Speed Insights there for actual Core Web Vitals tracking
2. **API Endpoints**: Use this service to provide Speed Insights configuration to your frontend via API endpoints
3. **Future Use**: Keep this integration for future scenarios where the API might serve HTML or need Speed Insights integration

The integration is ready and available but will be most effective when used with a frontend application or when this API serves HTML content.
