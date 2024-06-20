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
exports.ProvidersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../guards/auth.guard");
const auth_user_interceptor_service_1 = require("../../interceptors/auth-user-interceptor/auth-user-interceptor.service");
const providers_service_1 = require("./providers.service");
const addProvider_1 = require("../../dto/provider/addProvider");
const providerListingFilter_1 = require("../../dto/provider/providerListingFilter");
const calender_details_1 = require("../../dto/medical-center/calender-details");
const platform_express_1 = require("@nestjs/platform-express");
let ProvidersController = class ProvidersController {
    constructor(_providerSrv) {
        this._providerSrv = _providerSrv;
    }
    async addProvider(providerInfo, request) {
        return this._providerSrv.addProvider(providerInfo, request);
    }
    async updateProvider(providerInfo, providerID, request) {
        return this._providerSrv.updateProvider(providerInfo, providerID, request);
    }
    async deleteProvider(providerID, request) {
        return this._providerSrv.deleteProvider(providerID, request);
    }
    async getProviderListing(request, params) {
        return await this._providerSrv.getProviderListing(request, params);
    }
    async getSpecializations(request) {
        return await this._providerSrv.getSpezializations(request);
    }
    async getMedicalCenters(request) {
        return await this._providerSrv.getMedicalCenters(request);
    }
    async getRooms(request, medicalCenterID) {
        return await this._providerSrv.getRooms(medicalCenterID, request);
    }
    async roomOfMedAndSpeclization(request, specializationID, medicalCenterID) {
        return await this._providerSrv.roomOfMedAndSpeclization(medicalCenterID, specializationID, request);
    }
    async getProviderInfo(providerID, request) {
        return await this._providerSrv.getProviderInfo(providerID, request);
    }
    async getProviderCalender(providerID, request, params) {
        console.log("request for calender data");
        return await this._providerSrv.getProviderCalender(providerID, request, params);
    }
    async getProviderCalenderMonthListing(providerID, request, params) {
        return await this._providerSrv.getProviderCalenderMonthListing(providerID, request, params);
    }
    async importCsvData(request, file) {
        return await this._providerSrv.importCsvData(file.buffer);
    }
};
__decorate([
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addProvider_1.addProviderDTO, Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "addProvider", null);
__decorate([
    (0, common_1.Post)("update/:providerID"),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("providerID")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addProvider_1.addProviderDTO, Number, Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "updateProvider", null);
__decorate([
    (0, common_1.Post)("delete/:providerID"),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    __param(0, (0, common_1.Param)("providerID")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "deleteProvider", null);
__decorate([
    (0, common_1.Get)("get"),
    (0, swagger_1.ApiQuery)({
        name: "region",
        required: true,
        description: "Enter 0 for all region else enter specific region id",
    }),
    (0, swagger_1.ApiQuery)({ name: "page", required: true, description: "Start from 0" }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: true, description: "Keep it 10" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, providerListingFilter_1.ProviderListingFilter]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getProviderListing", null);
__decorate([
    (0, common_1.Get)("specializations"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getSpecializations", null);
__decorate([
    (0, common_1.Get)("med-centers"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getMedicalCenters", null);
__decorate([
    (0, common_1.Get)("rooms/:medicalCenterID"),
    (0, swagger_1.ApiParam)({ name: "medicalCenterID", required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("medicalCenterID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getRooms", null);
__decorate([
    (0, common_1.Get)("rooms/:medicalCenterID/:specializationID"),
    (0, swagger_1.ApiParam)({ name: "medicalCenterID", required: true }),
    (0, swagger_1.ApiParam)({ name: "specializationID", required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("specializationID")),
    __param(2, (0, common_1.Param)("medicalCenterID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "roomOfMedAndSpeclization", null);
__decorate([
    (0, common_1.Get)("get/:providerID"),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    __param(0, (0, common_1.Param)("providerID")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getProviderInfo", null);
__decorate([
    (0, common_1.Get)("get/calender/:providerID"),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, description: "2024-03-25" }),
    __param(0, (0, common_1.Param)("providerID")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, calender_details_1.MedicalCalender]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getProviderCalender", null);
__decorate([
    (0, common_1.Get)("calender/details/:providerID"),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, description: "2024-03-25" }),
    __param(0, (0, common_1.Param)("providerID")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, calender_details_1.MedicalCalender]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getProviderCalenderMonthListing", null);
__decorate([
    (0, common_1.Post)('import-csv-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        type: 'multipart/form-data',
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
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "importCsvData", null);
ProvidersController = __decorate([
    (0, common_1.Controller)("providers"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuardJWT),
    (0, common_1.UseInterceptors)(auth_user_interceptor_service_1.AuthUserInterceptorService),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Providers"),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersController);
exports.ProvidersController = ProvidersController;
//# sourceMappingURL=providers.controller.js.map