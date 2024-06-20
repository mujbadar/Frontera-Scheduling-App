/// <reference types="multer" />
import { ProvidersService } from "./providers.service";
import { addProviderDTO } from "src/dto/provider/addProvider";
import { Request } from "express";
import { ProviderListingFilter } from "src/dto/provider/providerListingFilter";
import { MedicalCalender } from "src/dto/medical-center/calender-details";
export declare class ProvidersController {
    private _providerSrv;
    constructor(_providerSrv: ProvidersService);
    addProvider(providerInfo: addProviderDTO, request: Request): Promise<string | {
        message: string;
    }>;
    updateProvider(providerInfo: addProviderDTO, providerID: number, request: Request): Promise<string | {
        message: string;
    }>;
    deleteProvider(providerID: number, request: Request): Promise<"Access denied" | {
        message: string;
    }>;
    getProviderListing(request: Request, params: ProviderListingFilter): Promise<{
        listing: any;
        listingCount: any;
    }>;
    getSpecializations(request: Request): Promise<any>;
    getMedicalCenters(request: Request): Promise<any>;
    getRooms(request: Request, medicalCenterID: number): Promise<any>;
    roomOfMedAndSpeclization(request: Request, specializationID: number, medicalCenterID: number): Promise<any>;
    getProviderInfo(providerID: number, request: Request): Promise<any>;
    getProviderCalender(providerID: number, request: Request, params: MedicalCalender): Promise<any>;
    getProviderCalenderMonthListing(providerID: number, request: Request, params: MedicalCalender): Promise<any>;
    importCsvData(request: Request, file: Express.Multer.File): Promise<{
        message: string;
    }>;
}
