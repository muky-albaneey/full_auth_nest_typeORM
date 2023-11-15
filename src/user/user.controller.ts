/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { SignInDto, SignAuthDto, UserUpdateDto } from './dto/uset.dto';

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
  async signUp(@Body() user: SignAuthDto) {
    return this.userservice.createUser(user);
  }

  @Put('reset')
  async resetPassword(@Body() body : UserUpdateDto) {
    return this.userservice.resetPassword(body);
  }
  
  @Put('update')
  async updateProfile(@Body() body : UserUpdateDto) {
    return this.userservice.updateAcccount(body)
  }

  @Post('login')
  async logIn(@Body() body  : SignInDto){
    return this.userservice.logIn(body)
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req){
      return await this.userservice.refreshToken(req.user) 
  }
   
}
