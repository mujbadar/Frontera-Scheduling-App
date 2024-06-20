"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const express_1 = require("express");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const bad_request_filter_1 = require("./filters/bad-request.filter");
const exception_filter_1 = require("./filters/exception.filter");
const query_failed_filter_1 = require("./filters/query-failed.filter");
const config_service_1 = require("./shared/services/config/config.service");
const shared_module_1 = require("./shared/shared.module");
const swagger_1 = require("./swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.enableCors({
        origin: 'https://fronterascheduling.com',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalFilters(new bad_request_filter_1.HttpExceptionFilter(reflector), new query_failed_filter_1.QueryFailedFilter(reflector), new exception_filter_1.ErrorFilter(reflector));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(reflector));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        dismissDefaultMessages: false,
        validationError: {
            target: false,
        },
    }));
    const configService = app.select(shared_module_1.SharedModule).get(config_service_1.ConfigService);
    (0, swagger_1.setupSwagger)(app);
    const port = configService.getNumber('PORT');
    await app.listen(port);
    console.info(`server running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map