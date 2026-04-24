import { Test, TestingModule } from '@nestjs/testing';
import { SpeedInsightsService } from './speed-insights.service';

describe('SpeedInsightsService', () => {
  let service: SpeedInsightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeedInsightsService],
    }).compile();

    service = module.get<SpeedInsightsService>(SpeedInsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a valid script tag', () => {
    const scriptTag = service.getScriptTag();
    expect(scriptTag).toContain('window.si');
    expect(scriptTag).toContain('/_vercel/speed-insights/script.js');
  });

  it('should return valid config', () => {
    const config = service.getConfig();
    expect(config).toHaveProperty('enabled');
    expect(config).toHaveProperty('route');
    expect(config.enabled).toBe(true);
  });

  it('should check if Speed Insights is available', () => {
    const available = service.isAvailable();
    expect(typeof available).toBe('boolean');
  });

  it('should log status without errors', () => {
    expect(() => service.logStatus()).not.toThrow();
  });
});
