import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(configService: ConfigService) {
    const jwksUri = configService.get<string>('SUPABASE_JWKS_URL');
    if (!jwksUri) {
      throw new UnauthorizedException('SUPABASE_JWKS_URL is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const email = payload.email;

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId,
      email,
      raw: payload,
    };
  }
}
