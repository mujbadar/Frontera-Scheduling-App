import { addAvailabilityDTO } from "src/dto/requests/addAvailability.dto";
import { addRequestDTO } from "src/dto/requests/addRequest.dto";
import { QueryService } from "src/shared/services/query/query.service";
import { updateAvailbilityDTO } from "src/dto/requests/updateAvailability.dto";
import { EmailService } from "src/shared/services/email/email.service";
export declare class RequestsService {
    private _db;
    private emailService;
    constructor(_db: QueryService, emailService: EmailService);
    addRequest(requestInfo: addRequestDTO, req: any): Promise<string | {
        message: string;
    }>;
    showRequests(req: any): Promise<any>;
    getRequestDetails(requestID: any, req: any): Promise<any>;
    addAvailability(availbilityInfo: addAvailabilityDTO, req: any): Promise<{
        data: {};
        message: string;
    }>;
    updateAvailability(availabilityInfo: updateAvailbilityDTO, requestID: any, req: any): Promise<{
        data: {};
        message: string;
    }>;
    getProviderAvailability(request: any): Promise<any>;
    isOverlapping(startTime: any, endTime: any, shifts: any): any;
    getWeekdaysBetween(start: any, end: any, skipWeekend: any, excludedDates: any): any[];
    getNotifications(req: any): Promise<any>;
    getProviderRequestDetails(requestID: any, req: any): Promise<any>;
    getRequestOfProvider(providerID: any, req: any): Promise<any>;
    getProvidersAgainstRequest(req: any): Promise<any>;
    getProviderScheduleAgainstRequest(providerID: any, requestID: any, req: any): Promise<any>;
    updateProviderAvailability(availabilityInfo: updateAvailbilityDTO, requestID: any, providerID: any, req: any): Promise<{
        data: {};
        message: string;
    }>;
    getProviderSchedule(providerID: any, req: any): Promise<any>;
}
