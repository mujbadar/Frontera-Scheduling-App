import { JwtService } from "@nestjs/jwt";
import { signUpDTO } from "src/dto/users/userSIgnUp.dto";
import { ConfigService } from "src/shared/services/config/config.service";
import { QueryService } from "src/shared/services/query/query.service";
import { EmailService } from "src/shared/services/email/email.service";
import { resetPasswordDTO } from "src/dto/users/userSignIn.dto";
export declare class AuthService {
    private db;
    private configService;
    private jwtService;
    private emailService;
    constructor(db: QueryService, configService: ConfigService, jwtService: JwtService, emailService: EmailService);
    signUpUser(data: signUpDTO, hash: string): Promise<any>;
    findOne(email: string): Promise<any>;
    returnUserWithToken(userEntity: any, request: any): Promise<any>;
    createToken(user: any, request: any): Promise<any>;
    validateUser(userLoginDto: any): Promise<any>;
    generatePasswordLink(userEmail: string, request: any): Promise<any>;
    updatePassword(formData: resetPasswordDTO, hashedPassword: any, req: any): Promise<string | {
        message: string;
    }>;
    getRandomString(length: any): string;
}
