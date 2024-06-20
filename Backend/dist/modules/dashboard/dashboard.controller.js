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
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../guards/auth.guard");
const swagger_1 = require("@nestjs/swagger");
const auth_user_interceptor_service_1 = require("../../interceptors/auth-user-interceptor/auth-user-interceptor.service");
const calender_details_1 = require("../../dto/medical-center/calender-details");
let DashboardController = class DashboardController {
    constructor(_dashboardService) {
        this._dashboardService = _dashboardService;
    }
    async exportCSV(res) {
        return await this._dashboardService.generateCSV(res);
    }
    async calenderStats(request, params) {
        return await this._dashboardService.calenderStats(request, params);
    }
    async calenderDetailList(request, params) {
        return await this._dashboardService.calenderDetailList(request, params);
    }
    async exportCalenderData(request, params) {
        return await this._dashboardService.exportCalenderData(request, params);
    }
};
__decorate([
    (0, common_1.Get)('dummy-csv-customers'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "exportCSV", null);
__decorate([
    (0, common_1.Get)('calender'),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, description: '2024-03-25' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, calender_details_1.MedicalCalender]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "calenderStats", null);
__decorate([
    (0, common_1.Get)('calender/details'),
    (0, swagger_1.ApiQuery)({ name: "region", required: true, description: 'Enter 0 for all region else enter specific region id' }),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, description: '2024-03-25' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, calender_details_1.DashboardCalenderDetailFilter]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "calenderDetailList", null);
__decorate([
    (0, common_1.Get)('export-calender'),
    (0, swagger_1.ApiQuery)({ name: "month", required: true, description: '2024-03-25' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, calender_details_1.DashboardCalenderExport]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "exportCalenderData", null);
DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuardJWT),
    (0, common_1.UseInterceptors)(auth_user_interceptor_service_1.AuthUserInterceptorService),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Dashbaord'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map