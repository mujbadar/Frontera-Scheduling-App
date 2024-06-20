"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("./services/config/config.service");
const files_service_1 = require("./services/files/files.service");
const query_service_1 = require("./services/query/query.service");
const email_service_1 = require("./services/email/email.service");
const providers = [
    config_service_1.ConfigService,
    query_service_1.QueryService,
    files_service_1.FileService,
    email_service_1.EmailService
];
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [config_service_1.ConfigService, query_service_1.QueryService, files_service_1.FileService, email_service_1.EmailService],
        exports: [...providers],
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map