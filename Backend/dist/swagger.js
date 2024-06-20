"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API')
        .setVersion('0.0.1')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('', app, document);
}
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map