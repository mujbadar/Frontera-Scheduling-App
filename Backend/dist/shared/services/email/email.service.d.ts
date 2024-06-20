import { passwordResetLink, signUpEmail, updateAvailbilityEmail } from 'src/dto/users/userSIgnUp.dto';
export declare class EmailService {
    constructor();
    generatePasswordLink(data: passwordResetLink): Promise<{
        message: string;
    }>;
    sendPassword(data: signUpEmail): Promise<{
        message: string;
    }>;
    sendUpdateScheduleEmail(data: updateAvailbilityEmail): Promise<{
        message: string;
    }>;
    private sendEmail;
}
