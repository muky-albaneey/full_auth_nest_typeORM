/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import {Observable} from 'rxjs';



@Injectable()
export class RefreshJwtGuard implements CanActivate {

    constructor (private readonly jwt: JwtService){}
    async   canActivate(
        context: ExecutionContext,
      ): Promise<boolean>{
        
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if(!token) throw new UnauthorizedException();

      try {
            const payload = await this.jwt.verifyAsync(token,{
            secret: process.env.jwtRefreshKeys
        });
        request['user'] = payload;

      } catch{
        throw new UnauthorizedException();
      }

      return true;
    }

    private extractToken(req : Request,){
        const [type, token] = req.headers.authorization?.split(' ')?? [];

        return type === 'Refresh' ? token : undefined;
    }

}