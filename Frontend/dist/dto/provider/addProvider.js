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
exports.availabilityTimings = exports.addProviderDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class addProviderDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], addProviderDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], addProviderDTO.prototype, "specializationID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], addProviderDTO.prototype, "medicalCenterID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], addProviderDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], addProviderDTO.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], addProviderDTO.prototype, "preferrRoomID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => availabilityTimings, isArray: true }),
    (0, class_transformer_1.Type)(() => availabilityTimings),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], addProviderDTO.prototype, "availability", void 0);
exports.addProviderDTO = addProviderDTO;
var ShiftType;
(function (ShiftType) {
    ShiftType["Morning"] = "MORNING";
    ShiftType["Afternoon"] = "AFTERNOON";
    ShiftType["Full"] = "FULL";
})(ShiftType || (ShiftType = {}));
class availabilityTimings {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ShiftType }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], availabilityTimings.prototype, "shiftType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], availabilityTimings.prototype, "shiftFromTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], availabilityTimings.prototype, "shiftToTime", void 0);
exports.availabilityTimings = availabilityTimings;
//# sourceMappingURL=addProvider.js.map