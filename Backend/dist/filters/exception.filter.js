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
exports.ErrorFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const responseData_dto_1 = require("../dto/responseData.dto");
let ErrorFilter = class ErrorFilter {
    constructor(reflector) {
        this.reflector = reflector;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = exception.constraint && exception.constraint.startsWith('UQ')
            ? common_1.HttpStatus.CONFLICT
            : exception.status ? exception.status : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const resp = new responseData_dto_1.responseData({});
        resp.success = false;
        resp.message = exception === null || exception === void 0 ? void 0 : exception.message;
        if (statusCode == common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            resp.exception = exception === null || exception === void 0 ? void 0 : exception.stack;
        }
        response.status(statusCode).json(resp);
    }
};
ErrorFilter = __decorate([
    (0, common_1.Catch)(Error),
    __metadata("design:paramtypes", [core_1.Reflector])
], ErrorFilter);
exports.ErrorFilter = ErrorFilter;
//# sourceMappingURL=exception.filter.js.map