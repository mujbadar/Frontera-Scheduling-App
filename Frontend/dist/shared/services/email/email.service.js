"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const email_1 = require("../../../dto/email/email");
const sgMail = require("@sendgrid/mail");
let EmailService = class EmailService {
    constructor() {
        sgMail.setApiKey(process.env.SEND_GRID_MAIL_API_KEY);
    }
    async generatePasswordLink(data) {
        const email = new email_1.EmailConfiguration();
        let forgotPasswordLink = process.env.DOMAIN_URL + 'reset/' + data.resetUrl;
        email.dynamic_template_data = { email: data.recieverEmail, name: data.recieverName, token: forgotPasswordLink };
        email.subject = "Reset Password link";
        email.templateId = "d-2f777619c7d34d74be56ce9155a0af5a";
        email.to = data.recieverEmail;
        return await this.sendEmail(email);
    }
    async sendPassword(data) {
        const email = new email_1.EmailConfiguration();
        email.dynamic_template_data = { password: data.password };
        email.subject = "Thank you for signing up!";
        email.templateId = "d-f5eb8e90fba4453a9fb103cfbd96fd8a";
        email.to = data.recieverEmail;
        return await this.sendEmail(email);
    }
    async sendUpdateScheduleEmail(data) {
        const email = new email_1.EmailConfiguration();
        email.dynamic_template_data = { deadline: data.deadline, login_url: data.login_url };
        email.templateId = "d-68f564ef2f9245a3a39c38a71ca5ee2c";
        email.to = data.recieverEmail;
        return await this.sendEmail(email);
    }
    async sendEmail(email) {
        try {
            let sendEmail = await sgMail.send(email);
            return { message: 'Email Send Successfully' };
        }
        catch (e) {
            console.log(e);
            return;
        }
    }
};
EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map