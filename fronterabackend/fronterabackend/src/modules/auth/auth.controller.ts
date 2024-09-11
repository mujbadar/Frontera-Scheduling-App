import { AuthService } from './auth.service';
import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { resetPasswordDTO, signInDTO } from 'src/dto/users/userSignIn.dto';
import { signUpDTO } from 'src/dto/users/userSIgnUp.dto';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {


    constructor(private _authService:AuthService){}


    @Post("sign-up")
    async createUser(@Body() formData:signUpDTO, @Req() request: Request ){
        let hashedPassword=bcrypt.hashSync(formData.password,10)
        formData.email = formData.email.toLowerCase();
        let isEmailExisting = await this._authService.findOne(formData.email);
        if (isEmailExisting) {
            return 'This email is associated with another account';
        }
        else{
           let userData= await this._authService.signUpUser(formData,hashedPassword);
           return this._authService.returnUserWithToken(userData, request)
        }
    }

    @Post("login")
    async loginUser(@Body() formData:signInDTO, @Req() request: Request){
        formData.email = formData.email.toLowerCase();
        let user = await this._authService.validateUser(formData);
        if (typeof (user) == 'string') return user;
        return this._authService.returnUserWithToken(user, request)
    }

    @Post("generatePasswordLink/:userEmail")
async generatePasswordLink(@Param('userEmail') userEmail: string, @Req() request: Request) {
    try {
        const result = await this._authService.generatePasswordLink(userEmail, request);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, exception: error.message, data: {} };
    }
}


    @Post("updatePassword")
    async updatePassword(@Body() formData: resetPasswordDTO, @Req() request: Request) {
        let hashedPassword=bcrypt.hashSync(formData.password,10)
        return await this._authService.updatePassword(formData,hashedPassword, request);
    }

}
