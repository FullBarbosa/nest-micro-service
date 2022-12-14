import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'node:util';
import { expressjwt as jwt, GetVerificationKey } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;

  constructor(private configService: ConfigService) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') ?? '';
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') ?? '';
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Guard HTTP requests
    // const httpContext = context.switchToHttp();
    // const req = httpContext.getRequest();
    // const res = httpContext.getResponse();

    //Guard GraphQL requests
    const { req, res } = GqlExecutionContext.create(context).getContext();

    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }) as GetVerificationKey,
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJwt(req, res);
      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
