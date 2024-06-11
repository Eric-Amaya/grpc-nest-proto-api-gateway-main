import { Injectable, CanActivate, ExecutionContext, HttpStatus, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const request: Request = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token, 
        {
          secret: process.env.JWT_SECRET,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException("");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}