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
exports.DashboardService = void 0;
const query_service_1 = require("./../../shared/services/query/query.service");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
const libre = require("libreoffice-convert");
const util_1 = require("util");
const createCsvWriter = require("csv-writer");
const moment = require("moment");
const convertAsync = (0, util_1.promisify)(libre.convert);
let DashboardService = class DashboardService {
    constructor(_db) {
        this._db = _db;
    }
    async prepareFileFoler(ext) {
        const mediaFolderPath = path.join(__dirname, '..', '..', '..', 'src', 'csvFiles');
        if (!fs.existsSync(mediaFolderPath)) {
            fs.mkdirSync(mediaFolderPath, { recursive: true });
        }
        const fileName = `${(0, uuid_1.v4)()}${ext}`;
        const filePath = path.join(mediaFolderPath, fileName);
        return filePath;
    }
    async generateCSV(res) {
        const data = await this._db.select("call sp_get_customer_info_for_csv()", [], true);
        data.forEach(element => {
            element.trial == 1 ? element.trial = 'true' : element.trial = 'false';
            element.startDate = moment(element.startDate).format('MMM DD,YYYY').toString();
            element.endDate = moment(element.endDate).format('MMM DD,YYYY').toString();
            element.daysLeft = (element.endDate && element.startDate) ? Math.round(Math.max(moment(element.endDate, 'MMM DD,YYYY').endOf('day').diff(moment(new Date(), 'MMM DD,YYYY'), 'days', true), 0))
                : 0;
            element.daysLeft = element.daysLeft.toString();
        });
        const filePath = await this.prepareFileFoler('.csv');
        const csvWriter = createCsvWriter.createObjectCsvWriter({
            path: filePath,
            header: [
                'Company Name',
                'Company Email',
                'User',
                'PCID',
                'App',
                'Trial',
                'Start Date',
                'End Date',
                'Days Left',
            ],
        });
        const formattedData = data.map((item) => ({
            'Company Name': item.companyName || '',
            'Company Email': item.companyEmail || '',
            'User': item.user || '',
            'PCID': item.PCID || '',
            'App': item.app || '',
            'Trial': item.trial || '',
            'Start Date': item.startDate || '',
            'End Date': item.endDate || '',
            'Days Left': item.daysLeft || '',
        }));
        formattedData.unshift({
            'Company Name': 'Company Name',
            'Company Email': 'Company Email',
            'User': 'User',
            'PCID': 'PCID',
            'App': 'App',
            'Trial': 'Trial',
            'Start Date': 'Start Date',
            'End Date': 'End Date',
            'Days Left': 'Days Left',
        });
        const currentDate = moment(new Date()).format('MMM DD,YYYY').toString();
        formattedData.unshift({
            'Company Name': 'Current Date',
            'Company Email': currentDate,
            'User': '',
            'PCID': '',
            'App': '',
            'Trial': '',
            'Start Date': '',
            'End Date': '',
            'Days Left': '',
        });
        formattedData.splice(1, 0, {
            'Company Name': '',
            'Company Email': '',
            'User': '',
            'PCID': '',
            'App': '',
            'Trial': '',
            'Start Date': '',
            'End Date': '',
            'Days Left': '',
        });
        await csvWriter.writeRecords(formattedData);
        res.download(filePath, 'exported_data.csv', async (err) => {
            if (err) {
                console.error('Error sending the file:', err);
            }
            const unlink = (0, util_1.promisify)(fs.unlink);
            await unlink(filePath);
        });
    }
    async calenderStats(req, params) {
        return await this._db.select("call sp_dash_get_calender_stats(?)", [[
                req.user.role == "ADMIN",
                params.month,
                req.user.id
            ]], true);
    }
    async calenderDetailList(req, params) {
        return await this._db.select("call sp_dash_get_calender_detail_list(?)", [[
                req.user.role == "ADMIN",
                params.month,
                req.user.id,
                params.region
            ]], true);
    }
    async exportCalenderData(req, params) {
        return await this._db.select("call sp_dash_get_export_calender_data(?)", [[
                req.user.role == "ADMIN",
                req.user.id,
                params.month
            ]], true);
    }
};
DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [query_service_1.QueryService])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map