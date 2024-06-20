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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const common_1 = require("@nestjs/common");
const userSignIn_dto_1 = require("../../dto/users/userSignIn.dto");
const userSIgnUp_dto_1 = require("../../dto/users/userSIgnUp.dto");
const bcrypt = require("bcryptjs");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(_authService) {
        this._authService = _authService;
    }
    async createUser(formData, request) {
        let hashedPassword = bcrypt.hashSync(formData.password, 10);
        formData.email = formData.email.toLowerCase();
        let isEmailExisting = await this._authService.findOne(formData.email);
        if (isEmailExisting) {
            return 'This email is associated with another account';
        }
        else {
            let userData = await this._authService.signUpUser(formData, hashedPassword);
            return this._authService.returnUserWithToken(userData, request);
        }
    }
    async loginUser(formData, request) {
        formData.email = formData.email.toLowerCase();
        let user = await this._authService.validateUser(formData);
        if (typeof (user) == 'string')
            return user;
        return this._authService.returnUserWithToken(user, request);
    }
    async generatePasswordLink(userEmail, request) {
        return await this._authService.generatePasswordLink(userEmail, request);
    }
    async updatePassword(formData, request) {
        let hashedPassword = bcrypt.hashSync(formData.password, 10);
        return await this._authService.updatePassword(formData, hashedPassword, request);
    }
};
__decorate([
    (0, common_1.Post)("sign-up"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userSIgnUp_dto_1.signUpDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userSignIn_dto_1.signInDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)("generatePasswordLink/:userEmail"),
    __param(0, (0, common_1.Param)('userEmail')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generatePasswordLink", null);
__decorate([
    (0, common_1.Post)("updatePassword"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [userSignIn_dto_1.resetPasswordDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePassword", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map