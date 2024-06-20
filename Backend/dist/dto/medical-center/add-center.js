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
exports.updateMedicalRoomsDTO = exports.medicalRoomsDTO = exports.updateMedicalCenterDTO = exports.medicalCenterDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class medicalCenterDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], medicalCenterDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], medicalCenterDTO.prototype, "regionID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], medicalCenterDTO.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], medicalCenterDTO.prototype, "poc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], medicalCenterDTO.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], medicalCenterDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => medicalRoomsDTO, isArray: true }),
    (0, class_transformer_1.Type)(() => medicalRoomsDTO),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], medicalCenterDTO.prototype, "rooms", void 0);
exports.medicalCenterDTO = medicalCenterDTO;
class updateMedicalCenterDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateMedicalCenterDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], updateMedicalCenterDTO.prototype, "regionID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateMedicalCenterDTO.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateMedicalCenterDTO.prototype, "poc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateMedicalCenterDTO.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateMedicalCenterDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => updateMedicalRoomsDTO, isArray: true }),
    (0, class_transformer_1.Type)(() => updateMedicalRoomsDTO),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], updateMedicalCenterDTO.prototype, "rooms", void 0);
exports.updateMedicalCenterDTO = updateMedicalCenterDTO;
class medicalRoomsDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], medicalRoomsDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], medicalRoomsDTO.prototype, "specializationID", void 0);
exports.medicalRoomsDTO = medicalRoomsDTO;
class updateMedicalRoomsDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], updateMedicalRoomsDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], updateMedicalRoomsDTO.prototype, "isDeleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], updateMedicalRoomsDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], updateMedicalRoomsDTO.prototype, "specializationID", void 0);
exports.updateMedicalRoomsDTO = updateMedicalRoomsDTO;
//# sourceMappingURL=add-center.js.map