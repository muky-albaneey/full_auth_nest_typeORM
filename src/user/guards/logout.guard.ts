/* eslint-disable prettier/prettier */
// src/auth/guards/logout.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogoutGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      return false; // No token, unauthorized
    }
    
    const payload = this.jwtService.decode(token.replace('Bearer ', '')) as { sub: string };
    

    return true;
  }
}
