import { AuthService } from './auth.service';
import { resetPasswordDTO, signInDTO } from 'src/dto/users/userSignIn.dto';
import { signUpDTO } from 'src/dto/users/userSIgnUp.dto';
import { Request } from 'express';
export declare class AuthController {
    private _authService;
    constructor(_authService: AuthService);
    createUser(formData: signUpDTO, request: Request): Promise<any>;
    loginUser(formData: signInDTO, request: Request): Promise<any>;
    generatePasswordLink(userEmail: string, request: Request): Promise<any>;
    updatePassword(formData: resetPasswordDTO, request: Request): Promise<string | {
        message: string;
    }>;
}
