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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../guards/auth.guard");
const auth_user_interceptor_service_1 = require("../../interceptors/auth-user-interceptor/auth-user-interceptor.service");
const requests_service_1 = require("./requests.service");
const addRequest_dto_1 = require("../../dto/requests/addRequest.dto");
const addAvailability_dto_1 = require("../../dto/requests/addAvailability.dto");
const updateAvailability_dto_1 = require("../../dto/requests/updateAvailability.dto");
let RequestsController = class RequestsController {
    constructor(_reqSrv) {
        this._reqSrv = _reqSrv;
    }
    async addRequest(requestInfo, request) {
        return this._reqSrv.addRequest(requestInfo, request);
    }
    async showRequests(request) {
        return this._reqSrv.showRequests(request);
    }
    async getRequestDetails(request, requestID) {
        return this._reqSrv.getRequestDetails(requestID, request);
    }
    async getProviderAvailability(request) {
        return this._reqSrv.getProviderAvailability(request);
    }
    async addAvailability(availabilityInfo, request) {
        return this._reqSrv.addAvailability(availabilityInfo, request);
    }
    async updateAvailbility(availabilityInfo, requestID, request) {
        return this._reqSrv.updateAvailability(availabilityInfo, requestID, request);
    }
    async getNotifications(request) {
        return this._reqSrv.getNotifications(request);
    }
    async getProviderRequestDetails(requestID, request) {
        return this._reqSrv.getProviderRequestDetails(requestID, request);
    }
    async getProvidersAgainstRequest(request) {
        return this._reqSrv.getProvidersAgainstRequest(request);
    }
    async getRequestOfProvider(providerID, request) {
        return this._reqSrv.getRequestOfProvider(providerID, request);
    }
    async getProviderScheduleAgainstRequest(requestID, providerID, request) {
        return this._reqSrv.getProviderScheduleAgainstRequest(providerID, requestID, request);
    }
    async updateProviderAvailability(availabilityInfo, requestID, providerID, request) {
        return this._reqSrv.updateProviderAvailability(availabilityInfo, requestID, providerID, request);
    }
    async getProviderSchedule(providerID, request) {
        return this._reqSrv.getProviderSchedule(providerID, request);
    }
};
__decorate([
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addRequest_dto_1.addRequestDTO, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "addRequest", null);
__decorate([
    (0, common_1.Get)("listing"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "showRequests", null);
__decorate([
    (0, common_1.Get)("listing/:requestID"),
    (0, swagger_1.ApiParam)({ name: "requestID", required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('requestID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getRequestDetails", null);
__decorate([
    (0, common_1.Get)("provider-availability"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getProviderAvailability", null);
__decorate([
    (0, common_1.Post)("availability/add"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addAvailability_dto_1.addAvailabilityDTO, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "addAvailability", null);
__decorate([
    (0, common_1.Post)("availability/update/:requestID"),
    (0, swagger_1.ApiParam)({ name: "requestID", required: true }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('requestID')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateAvailability_dto_1.updateAvailbilityDTO, Number, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "updateAvailbility", null);
__decorate([
    (0, common_1.Get)("notifications"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)("fetch-request-details/:requestID/"),
    (0, swagger_1.ApiParam)({ name: "requestID", required: true }),
    __param(0, (0, common_1.Param)("requestID")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getProviderRequestDetails", null);
__decorate([
    (0, common_1.Get)("providers"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getProvidersAgainstRequest", null);
__decorate([
    (0, common_1.Get)("provider/:providerID"),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    __param(0, (0, common_1.Param)("providerID")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getRequestOfProvider", null);
__decorate([
    (0, common_1.Get)("provider-details/:requestID/:providerID"),
    (0, swagger_1.ApiParam)({ name: "requestID", required: true }),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    __param(0, (0, common_1.Param)("requestID")),
    __param(1, (0, common_1.Param)("providerID")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getProviderScheduleAgainstRequest", null);
__decorate([
    (0, common_1.Post)("update-provider-availability/:requestID/:providerID"),
    (0, swagger_1.ApiParam)({ name: "requestID", required: true }),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('requestID')),
    __param(2, (0, common_1.Param)('providerID')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateAvailability_dto_1.updateAvailbilityDTO, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "updateProviderAvailability", null);
__decorate([
    (0, common_1.Get)("provider-schedule/:providerID"),
    (0, swagger_1.ApiParam)({ name: "providerID", required: true }),
    __param(0, (0, common_1.Param)("providerID")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getProviderSchedule", null);
RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuardJWT),
    (0, common_1.UseInterceptors)(auth_user_interceptor_service_1.AuthUserInterceptorService),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
exports.RequestsController = RequestsController;
//# sourceMappingURL=requests.controller.js.map