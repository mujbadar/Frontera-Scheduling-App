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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const userSIgnUp_dto_1 = require("../../dto/users/userSIgnUp.dto");
const config_service_1 = require("../../shared/services/config/config.service");
const query_service_1 = require("../../shared/services/query/query.service");
const bcrypt = require("bcryptjs");
const email_service_1 = require("../../shared/services/email/email.service");
const typeorm_1 = require("typeorm");
let AuthService = class AuthService {
    constructor(db, configService, jwtService, emailService) {
        this.db = db;
        this.configService = configService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async signUpUser(data, hash) {
        return this.db.insertUpdatDelete("call sp_auth_signup_user(?)", [[data.name, data.email, hash]], true);
    }
    async findOne(email) {
        let userNameExists = await this.db.selectSingle("select * from users where email=?", [email]);
        if (userNameExists)
            return userNameExists;
        else
            return false;
    }
    async returnUserWithToken(userEntity, request) {
        if (typeof userEntity == "object") {
            const token = await this.createToken(userEntity, request);
            userEntity = token;
        }
        return userEntity;
    }
    async createToken(user, request) {
        return {
            expiresIn: this.configService.get("JWT_EXPIRATION_TIME"),
            accessToken: await this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }),
        };
    }
    async validateUser(userLoginDto) {
        let { email, password } = userLoginDto;
        const user = await this.findOne(email);
        if (typeof user == "string")
            return user;
        if (Object.values(user).every((x) => x === null)) {
            return "invalid email/password";
        }
        const isPasswordValid = await bcrypt.compareSync(password, user.password);
        if (!user || !isPasswordValid) {
            return "Invalid user email or password";
        }
        return user;
    }
    async generatePasswordLink(userEmail, request) {
        const resetUrl = this.getRandomString(20);
        let emailResult;
        userEmail = userEmail.toLowerCase();
        let userUpdated = await this.db.selectSingle("select * from users where email=?", [userEmail]);
        if (userUpdated && userUpdated.id) {
            let data = new userSIgnUp_dto_1.passwordResetLink();
            data.recieverEmail = userEmail;
            data.resetUrl = resetUrl;
            data.recieverName = userUpdated.legalName;
            await this.db.insertUpdatDelete("update users set passwordResetToken=? where email=?", [resetUrl, data.recieverEmail]);
            emailResult = await this.emailService.generatePasswordLink(data);
            return emailResult;
        }
        else {
            return "Invalid user email!";
        }
    }
    async updatePassword(formData, hashedPassword, req) {
        let result = await (0, typeorm_1.getManager)().transaction(async (transactionalEntityManager) => {
            const userInfo = await transactionalEntityManager.query("SELECT * from users where passwordResetToken=?", [formData.token]);
            if (userInfo && userInfo[0]) {
                await transactionalEntityManager.query("UPDATE users SET password=? where id=?", [hashedPassword, userInfo[0].id]);
                return { message: "Password Updated Successfully" };
            }
            else {
                return "Incorrect token!";
            }
        });
        return result;
    }
    getRandomString(length) {
        var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var result = "";
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [query_service_1.QueryService,
        config_service_1.ConfigService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map