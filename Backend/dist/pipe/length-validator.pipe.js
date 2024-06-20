"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LengthValidatorPipe = void 0;
const common_1 = require("@nestjs/common");
let LengthValidatorPipe = class LengthValidatorPipe {
    transform(value, metadata) {
        const hexCodeRegex = /^[0-9a-fA-F]{20}$/;
        if (!hexCodeRegex.test(value.key) || value.key.length != 20) {
            throw new common_1.BadRequestException('Invalid parameter. Expected a 20-character hexadecimal code.');
        }
        return value;
    }
};
LengthValidatorPipe = __decorate([
    (0, common_1.Injectable)()
], LengthValidatorPipe);
exports.LengthValidatorPipe = LengthValidatorPipe;
//# sourceMappingURL=length-validator.pipe.js.map