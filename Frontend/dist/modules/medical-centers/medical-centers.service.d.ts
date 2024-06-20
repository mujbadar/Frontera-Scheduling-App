/// <reference types="node" />
import { medicalCenterDTO, updateMedicalCenterDTO } from "src/dto/medical-center/add-center";
import { MedicalCalender, MedicalCenterListingFilter } from "src/dto/medical-center/calender-details";
import { QueryService } from "src/shared/services/query/query.service";
export declare class MedicalCentersService {
    private _db;
    constructor(_db: QueryService);
    addMedicalCenter(medicalCenterInfo: medicalCenterDTO, req: any): Promise<string | {
        message: string;
    }>;
    updateMedicalCenter(medicalCenterInfo: updateMedicalCenterDTO, req: any, centerID: any): Promise<string | {
        message: string;
    }>;
    deleteMedicalCenters(centerID: any, req: any): Promise<"Access denied" | {
        message: string;
    }>;
    getMedicalCenterListing(req: any, params: MedicalCenterListingFilter): Promise<{
        listing: any;
        listingCount: any;
    }>;
    getMedicalCenterInfo(centerID: any, req: any): Promise<any>;
    getMedicalCenterCalender(centerID: any, req: any, param: MedicalCalender): Promise<any>;
    getMedicalCenterMonthListing(centerID: any, req: any, param: MedicalCalender): Promise<any>;
    getRegions(req: any): Promise<any>;
    getAllRegions(req: any): Promise<any>;
    importCsvData(buffer: any): Promise<{
        message: string;
    }>;
    parseSheetFromBuffer(buffer: Buffer, sheetNumber: number): any[] | null;
}
