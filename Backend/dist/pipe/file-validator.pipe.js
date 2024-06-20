"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileValidatorPipe = void 0;
const common_1 = require("@nestjs/common");
let FileValidatorPipe = class FileValidatorPipe {
    constructor() {
        this.allowedFileTypes = ['application/x-msdownload', 'application/x-ms-dos-executable'];
    }
    transform(value, metadata) {
        const file = value;
        const { mimetype } = file;
        if (!this.allowedFileTypes.includes(mimetype)) {
            throw new common_1.BadRequestException('Only EXE files are allowed');
        }
        return file;
    }
};
FileValidatorPipe = __decorate([
    (0, common_1.Injectable)()
], FileValidatorPipe);
exports.FileValidatorPipe = FileValidatorPipe;
//# sourceMappingURL=file-validator.pipe.js.map