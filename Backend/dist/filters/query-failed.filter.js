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
exports.QueryFailedFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const http_1 = require("http");
const typeorm_1 = require("typeorm");
let QueryFailedFilter = class QueryFailedFilter {
    constructor(reflector) {
        this.reflector = reflector;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const errorMessage = exception.message;
        const status = exception.constraint && exception.constraint.startsWith('UQ')
            ? common_1.HttpStatus.CONFLICT
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            statusCode: status,
            error: http_1.STATUS_CODES[status],
            message: errorMessage,
        });
    }
};
QueryFailedFilter = __decorate([
    (0, common_1.Catch)(typeorm_1.QueryFailedError),
    __metadata("design:paramtypes", [core_1.Reflector])
], QueryFailedFilter);
exports.QueryFailedFilter = QueryFailedFilter;
//# sourceMappingURL=query-failed.filter.js.map