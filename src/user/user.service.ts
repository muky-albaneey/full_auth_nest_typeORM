/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';

interface dataUpdate {        
    email?: string;
    password?: string;

    }

    

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

    async createUser(user: Partial<User>): Promise<User> {

        const userValidate = await this.Repository.findOne({
            where: {
                email: user.email
            }
        });  

        if(userValidate) throw new UnauthorizedException("The user exist!");
        
        const text =`You have succesfully login to our football app your username is : ${user.username} and your password is : ${user.password}`

        const subject = "YOUR CREDENTIALS FROM FOOTBALL APP";       
        const newUser = await this.Repository.create(user);
        const userSaved = await this.Repository.save(newUser); 

        // await this.email.sendEmail(user.email, subject, text);
        return userSaved      
    }    

    async logIn(email: string, password :string){

        const userCheck = await this.validateUser(email, password)
        const payload = {email : email, sub: {password : password},};
        return {
            userCheck,
            tokens :{
                jwtTokenKeys : await this.jwt.signAsync(payload, {
                    expiresIn: '35s',
                    // secret: process.env.jwtKeys,
                    secret: "23412332o442444i",
                }),
                
                refreshTokens :{
                    jwtTokenKeys : await this.jwt.signAsync(payload, {
                        expiresIn: '7d',
                        secret: "#12332o442444i",
                        // secret: process.env.jwtRefreshKeys,
                }),
            }
        }
    }
    }

    async resetPassword(body : Partial<User>){
        const user = await this.Repository.findOne({
            where: {
                email: body.email
            }
        });
    
        if(!user) throw new UnauthorizedException('please check your username')
    
         await this.Repository.update(user.id, body)

        const updatedInfo = await this.Repository.findOne({
            where: {
                email: body.email
            }
        });
        return updatedInfo;
    }

    async updateAcccount(body : Partial<User>){

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
