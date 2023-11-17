/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { SignAuthDto, SignInDto, UserUpdateDto } from './dto/uset.dto';

   

@Injectable()
export class UserService {   

    constructor(@InjectRepository(User) private readonly Repository: Repository<User>, 
    private readonly jwt : JwtService, private readonly email : EmailService){}


    async validateUser(email: string, password: string) : Promise<any>{

        const userValidate = await this.Repository.findOne({
            where: {
                email: email
            }
        });              

        if(userValidate && (await bcrypt.compare(password, userValidate.password))){
            const {password, ...result} = userValidate;
    
            return result;
        }
    }

    async createUser(user: SignAuthDto) : Promise <any>{

        const userValidate = await this.Repository.findOne({
            where: {
                email: user.email
            }
        });  

        if(userValidate) throw new UnauthorizedException("The user exist!");            

        const newUser = await this.Repository.create(user);
        const userSaved = await this.Repository.save(newUser); 
        
        
        // return userSaved   
        const payload = {email : userSaved.email, sub: {password : userSaved.password},};

         const tokens = {
            jwtTokenKeys: await this.jwt.signAsync(payload, {
                expiresIn: '35s',
                secret: process.env.jwtKeys,
            }),
            
            refreshTokens :{
                jwtTokenKeys : await this.jwt.signAsync(payload, {
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshKeys,
                }),
             }
        }
        
        const text =`Your account is succesfully  created a message has been sent to your mail`;
        const resetLink = `http://your-app-url/${tokens}`;
        const emailText = `Click the following link to verify your your: ${resetLink}`;
        const subject = "YOUR CREDENTIALS FROM FOOTBALL APP"; 
        await this.email.sendEmail(user.email, subject, emailText);        
        return text;
    }    

    async logIn({email, password} :SignInDto ){

        const userCheck = await this.validateUser(email, password)
        const payload = {email : email, sub: {password : password},};
        return {
            userCheck,
            tokens :{
                jwtTokenKeys : await this.jwt.signAsync(payload, {
                    expiresIn: '120s',
                    secret:" process.env.jwtKeys",
                    // secret: process.env.jwtKeys,
                }),
                
                refreshTokens :{
                    jwtTokenKeys : await this.jwt.signAsync(payload, {
                        expiresIn: '7d',
                        secret: "process.env.jwtRefreshKeys",
                        // secret: process.env.jwtRefreshKeys,
                }),
            }
        }
    }
    }

    async forgotPassword(mail : UserUpdateDto){
        const user = await this.Repository.findOne({
            where: {
                email: mail.email
            }
        });

             await this.Repository.update(user.id, mail);
            
             const updatedInfo = await this.Repository.findOne({
                where: {
                    email: mail.email
                }
            });
                return updatedInfo            
    }


    async resetPassword(mail : UserUpdateDto){
        const user = await this.Repository.findOne({
            where: {
                email: mail.email
            }
        });        
      
        const payload = {email : user.email, sub: {password : user.password},};
        if(!user) throw new UnauthorizedException('please check your username')
        
            
           const token ={
            jwtTokenKeys: await this.jwt.signAsync(payload, {
                expiresIn: '120s',
                secret: process.env.jwtKeys,
            }),
           };

            const subject = "YOUR TOKENS FROM FOOTBALL APP"; 
            const resetLink = `http://your-app-url/reset-password/${token}`;
            const emailText = `Click the following link to reset your password: ${resetLink}`;
                await this.email.sendEmail(user.email, subject, emailText)
      
            return { message: 'Password reset email sent successfully.' };  
      }

    async updateAcccount(body : UserUpdateDto){

        const user = await this.Repository.findOne({
            where : {
                email : body.email
            }
        });

        if(!user) throw new UnauthorizedException("The user does not exist!");

        //  await this.Repository.update(user.id, body)        
        await this.Repository.update(user.id, body)

        const updatedInfo = await this.Repository.findOne({
            where: {
                email: body.email
            }
        });
        return updatedInfo;
    }

    async refreshToken(user:any){
        const payload = {email : user.email, sub: user.sub};
    
        return{
            jwtTokenKeys: await this.jwt.signAsync(payload, {
                expiresIn: '35s',
                secret: process.env.jwtKeys,
            }),
            
            refreshTokens :{
                jwtTokenKeys : await this.jwt.signAsync(payload, {
                    expiresIn: '7d',
                    secret: process.env.jwtRefreshKeys,
                }),
             }
        }
      }
}
