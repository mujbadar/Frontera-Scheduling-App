import { addProviderDTO } from "src/dto/provider/addProvider";
import { QueryService } from "src/shared/services/query/query.service";
import { ProviderListingFilter } from "src/dto/provider/providerListingFilter";
import { MedicalCalender } from "src/dto/medical-center/calender-details";
import { EmailService } from "src/shared/services/email/email.service";
export declare class ProvidersService {
    private _db;
    private emailService;
    constructor(_db: QueryService, emailService: EmailService);
    addProvider(providerInfo: addProviderDTO, req: any): Promise<string | {
        message: string;
    }>;
    updateProvider(providerInfo: addProviderDTO, providerID: any, req: any): Promise<string | {
        message: string;
    }>;
    deleteProvider(providerID: any, req: any): Promise<"Access denied" | {
        message: string;
    }>;
    getProviderListing(req: any, params: ProviderListingFilter): Promise<{
        listing: any;
        listingCount: any;
    }>;
    getProviderInfo(providerID: any, req: any): Promise<any>;
    getProviderCalender(providerID: any, req: any, params: MedicalCalender): Promise<any>;
    getProviderCalenderMonthListing(providerID: any, req: any, params: MedicalCalender): Promise<any>;
    getSpezializations(req: any): Promise<any>;
    getMedicalCenters(req: any): Promise<any>;
    getRooms(medicalCenterID: any, req: any): Promise<any>;
    roomOfMedAndSpeclization(medicalCenterID: any, specializationID: any, req: any): Promise<any>;
    importCsvData(buffer: any): Promise<{
        message: string;
    }>;
    excelTimeToHHMM(excelTime: any): string;
    parseSheetFromBuffer(buffer: any, sheetNumber?: number): unknown[];
}
