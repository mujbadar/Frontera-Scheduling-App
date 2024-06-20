"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const shared_module_1 = require("./shared/shared.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_service_1 = require("./shared/services/config/config.service");
const query_service_1 = require("./shared/services/query/query.service");
const core_1 = require("@nestjs/core");
const http_interceptor_1 = require("./interceptors/httpinterceptor/http.interceptor");
const medical_centers_module_1 = require("./modules/medical-centers/medical-centers.module");
const providers_module_1 = require("./modules/providers/providers.module");
const requests_module_1 = require("./modules/requests/requests.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            dashboard_module_1.DashboardModule,
            medical_centers_module_1.MedicalCentersModule,
            providers_module_1.ProvidersModule,
            requests_module_1.RequestsModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [shared_module_1.SharedModule,],
                useFactory: (configService) => configService.typeOrmConfig,
                inject: [config_service_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, query_service_1.QueryService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: http_interceptor_1.HttpInterceptor,
            }],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map