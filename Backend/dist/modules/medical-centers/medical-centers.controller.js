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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalCentersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../guards/auth.guard");
const auth_user_interceptor_service_1 = require("../../interceptors/auth-user-interceptor/auth-user-interceptor.service");
const medical_centers_service_1 = require("./medical-centers.service");
const add_center_1 = require("../../dto/medical-center/add-center");
const calender_details_1 = require("../../dto/medical-center/calender-details");
const platform_express_1 = require("@nestjs/platform-express");
let MedicalCentersController = class MedicalCentersController {
    constructor(_medSrv) {
        this._medSrv = _medSrv;
    }
    async addMedicalCenter(medicalCenterInfo, request) {
        return this._medSrv.addMedicalCenter(medicalCenterInfo, request);
    }
    async updateMedicalCenter(medicalCenterInfo, centerID, request) {
        return this._medSrv.updateMedicalCenter(medicalCenterInfo, request, centerID);
    }
    async deleteMedicalCenters(centerID, request) {
        return this._medSrv.deleteMedicalCenters(centerID, request);
    }
    async getMedicalCenterListing(request, params) {
        return await this._medSrv.getMedicalCenterListing(request, params);
    }
    async getMedicalCenterInfo(medicalCenterID, request) {
        return await this._medSrv.getMedicalCenterInfo(medicalCenterID, request);
    }
    async getMedicalCenterCalender(medicalCenterID, request, params) {
        return await this._medSrv.getMedicalCenterCalender(medicalCenterID, request, params);
    }
    async getMedicalCenterMonthListing(medicalCenterID, request, params) {
        return await this._medSrv.getMedicalCenterMonthListing(medicalCenterID, request, params);
    }
    async getRegions(request) {
        return await this._medSrv.getRegions(request);
    }
    async importCsvData(request, file) {
        return await this._medSrv.importCsvData(file.buffer);
    }
};
__decorate([
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_center_1.medicalCenterDTO,
        Request]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "addMedicalCenter", null);
__decorate([
    (0, common_1.Post)("update/:centerID"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("centerID")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_center_1.updateMedicalCenterDTO, Number, Request]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "updateMedicalCenter", null);
__decorate([
    (0, common_1.Post)("delete/:centerID"),
    __param(0, (0, common_1.Param)("centerID")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Request]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "deleteMedicalCenters", null);
__decorate([
    (0, common_1.Get)("get"),
    (0, swagger_1.ApiQuery)({ name: "region", required: true, description: 'Enter 0 for all region else enter specific region id' }),
    (0, swagger_1.ApiQuery)({ name: "page", required: true, description: 'Start from 0' }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: true, description: 'Keep it 10' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, calender_details_1.MedicalCenterListingFilter]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "getMedicalCenterListing", null);
__decorate([
    (0, common_1.Get)("get/:medicalCenterID"),
    (0, swagger_1.ApiParam)({ name: "medicalCenterID", required: true }),
    __param(0, (0, common_1.Param)('medicalCenterID')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Request]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "getMedicalCenterInfo", null);
__decorate([
    (0, common_1.Get)("calender/:medicalCenterID"),
    (0, swagger_1.ApiParam)({ name: "medicalCenterID", required: true }),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, description: '2024-03-25' }),
    __param(0, (0, common_1.Param)('medicalCenterID')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Request, calender_details_1.MedicalCalender]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "getMedicalCenterCalender", null);
__decorate([
    (0, common_1.Get)("calender/details/:medicalCenterID"),
    (0, swagger_1.ApiParam)({ name: "medicalCenterID", required: true }),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, description: '2024-03-25' }),
    __param(0, (0, common_1.Param)('medicalCenterID')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Request, calender_details_1.MedicalCalender]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "getMedicalCenterMonthListing", null);
__decorate([
    (0, common_1.Get)("region"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "getRegions", null);
__decorate([
    (0, common_1.Post)('import-csv-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], MedicalCentersController.prototype, "importCsvData", null);
MedicalCentersController = __decorate([
    (0, common_1.Controller)("medical-centers"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuardJWT),
    (0, common_1.UseInterceptors)(auth_user_interceptor_service_1.AuthUserInterceptorService),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Medical Centers"),
    __metadata("design:paramtypes", [medical_centers_service_1.MedicalCentersService])
], MedicalCentersController);
exports.MedicalCentersController = MedicalCentersController;
//# sourceMappingURL=medical-centers.controller.js.map