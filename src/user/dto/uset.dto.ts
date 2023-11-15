/* eslint-disable prettier/prettier */
import { IsString, IsInt, IsEmail, IsOptional, IsNotEmpty, MinLength, MaxLength  } from 'class-validator';

export class UserUpdateDto {

    
    @IsOptional()
    @IsInt()
    id?: number;
    
    @IsOptional()
    @IsEmail()
    @IsString()     
    email?: string;
    
    @IsOptional()
    @MaxLength(5, {message : "The password should not exceed 5"})
    @MinLength(7, {message : "The password should exceed 7"})
    @IsString()
    password?: string;
    
    @IsOptional()
    @IsString()
    username?: string;
  }


  export class SignAuthDto{

    @IsString()
    @IsNotEmpty()
    username : string;

    // @Matches(/^\+?[1-9][0-9]{7,14}$/, {message : "Please provide a valid phone number"})
    // @IsNotEmpty()
    // @IsString()
    // phoneNumber : string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : string;

    @MinLength(5, {message : "The password should exceed 5"})
    @MaxLength(7, {message : "The password should not exceed 7"})
    @IsString()
    @IsNotEmpty()
    password : string
   
}

export class SignInDto{
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : string;

    @MinLength(5)
    @IsString()
    @IsNotEmpty()
    password : string
}
