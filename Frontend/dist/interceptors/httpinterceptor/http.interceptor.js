"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const responseData_dto_1 = require("../../dto/responseData.dto");
let HttpInterceptor = class HttpInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)(data => {
            if (typeof data == 'object') {
                return new responseData_dto_1.responseData(data);
            }
            else {
                let response = new responseData_dto_1.responseData({});
                response.success = false;
                response.message = data;
                return response;
            }
        }));
    }
};
HttpInterceptor = __decorate([
    (0, common_1.Injectable)()
], HttpInterceptor);
exports.HttpInterceptor = HttpInterceptor;
//# sourceMappingURL=http.interceptor.js.map