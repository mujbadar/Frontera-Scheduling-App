import { QueryService } from './../../shared/services/query/query.service';
import { DashboardCalenderDetailFilter, DashboardCalenderExport, MedicalCalender } from 'src/dto/medical-center/calender-details';
export declare class DashboardService {
    private _db;
    constructor(_db: QueryService);
    prepareFileFoler(ext: any): Promise<string>;
    generateCSV(res: any): Promise<void>;
    calenderStats(req: any, params: MedicalCalender): Promise<any>;
    calenderDetailList(req: any, params: DashboardCalenderDetailFilter): Promise<any>;
    exportCalenderData(req: any, params: DashboardCalenderExport): Promise<any>;
}
