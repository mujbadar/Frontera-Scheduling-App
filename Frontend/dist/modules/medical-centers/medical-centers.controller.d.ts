/// <reference types="multer" />
import { MedicalCentersService } from "./medical-centers.service";
import { medicalCenterDTO, updateMedicalCenterDTO } from "src/dto/medical-center/add-center";
import { MedicalCalender, MedicalCenterListingFilter } from "src/dto/medical-center/calender-details";
export declare class MedicalCentersController {
    private _medSrv;
    constructor(_medSrv: MedicalCentersService);
    addMedicalCenter(medicalCenterInfo: medicalCenterDTO, request: Request): Promise<string | {
        message: string;
    }>;
    updateMedicalCenter(medicalCenterInfo: updateMedicalCenterDTO, centerID: number, request: Request): Promise<string | {
        message: string;
    }>;
    deleteMedicalCenters(centerID: number, request: Request): Promise<"Access denied" | {
        message: string;
    }>;
    getMedicalCenterListing(request: Request, params: MedicalCenterListingFilter): Promise<{
        listing: any;
        listingCount: any;
    }>;
    getMedicalCenterInfo(medicalCenterID: number, request: Request): Promise<any>;
    getMedicalCenterCalender(medicalCenterID: number, request: Request, params: MedicalCalender): Promise<any>;
    getMedicalCenterMonthListing(medicalCenterID: number, request: Request, params: MedicalCalender): Promise<any>;
    getRegions(request: Request): Promise<any>;
    importCsvData(request: Request, file: Express.Multer.File): Promise<{
        message: string;
    }>;
}
