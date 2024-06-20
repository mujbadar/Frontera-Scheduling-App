import { DashboardService } from './dashboard.service';
import { Request, Response } from 'express';
import { DashboardCalenderDetailFilter, DashboardCalenderExport, MedicalCalender } from 'src/dto/medical-center/calender-details';
export declare class DashboardController {
    private _dashboardService;
    constructor(_dashboardService: DashboardService);
    exportCSV(res: Response): Promise<void>;
    calenderStats(request: Request, params: MedicalCalender): Promise<any>;
    calenderDetailList(request: Request, params: DashboardCalenderDetailFilter): Promise<any>;
    exportCalenderData(request: Request, params: DashboardCalenderExport): Promise<any>;
}
