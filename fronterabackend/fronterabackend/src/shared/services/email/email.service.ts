import { Injectable } from '@nestjs/common';
import { EmailConfiguration } from 'src/dto/email/email';
import { EMAIL_TEMPLATEIDS } from 'src/dto/email/email.constants';
import { passwordResetLink, signUpEmail, updateAvailbilityEmail } from 'src/dto/users/userSIgnUp.dto';
import * as sgMail from '@sendgrid/mail';
@Injectable()
export class EmailService {

    constructor(){
        sgMail.setApiKey(process.env.SEND_GRID_MAIL_API_KEY)
    }

    public async generatePasswordLink(data: passwordResetLink) {
        try {
            const email = new EmailConfiguration();
            let forgotPasswordLink = process.env.DOMAIN_URL + 'reset/' + data.resetUrl;
            email.dynamic_template_data = { email: data.recieverEmail, name: data.recieverName, token: forgotPasswordLink };
            email.subject = "Reset Password link";
            email.templateId = EMAIL_TEMPLATEIDS.RESET_PASSWORD_LINK;
            email.to = data.recieverEmail;
    
            const result = await this.sendEmail(email);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to generate password link');
        }
    }
    

    public async sendPassword(data:signUpEmail) {
        const email = new EmailConfiguration();
        email.dynamic_template_data = {password: data.password}
        email.subject = "Thank you for signing up!"; 
        email.templateId = EMAIL_TEMPLATEIDS.SIGNUP_PASSWORD;
        email.to=data.recieverEmail;
        return await this.sendEmail(email);
    
    }

    public async sendUpdateScheduleEmail(data:updateAvailbilityEmail) {
        const email = new EmailConfiguration();
        email.dynamic_template_data = {deadline: data.deadline, login_url: data.login_url}
        email.templateId = EMAIL_TEMPLATEIDS.UPDATE_AVAILBILITY;
        email.to=data.recieverEmail;
        return await this.sendEmail(email);
    
    }

    private async sendEmail(email: EmailConfiguration) {
        try {
            let sendEmail = await sgMail.send(email);
            return { message: 'Email Sent Successfully' };
        } catch (e) {
            console.error('Error sending email:', e.response?.body || e.message);
            return { message: 'Failed to send email', error: e.message };
        }
    }
    
    
}
