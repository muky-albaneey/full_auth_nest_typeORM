/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RefreshJwtGuard } from './guards/refresh.guard';

interface dataUpdate {   
    id?: number;     
    email?: string;
    password?: string;
    user?: string;
}

@Controller('user')
export class UserController {
constructor(private readonly userservice : UserService){}
    
  @Post('signup')
  async signUp(@Body() user: Partial<User>) {
    return this.userservice.createUser(user);
  }

  @Put('reset')
  async resetPassword(@Body() body : dataUpdate) {
    return this.userservice.resetPassword(body);
  }
  
  @Put('update')
  async updateProfile(@Body() body : dataUpdate) {
    return this.userservice.updateAcccount(body)
  }

  @Post('login')
  async logIn(@Body() body){
    return this.userservice.logIn(body.username, body.password)
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req){
      return await this.userservice.refreshToken(req.user) 
  }
   
}
