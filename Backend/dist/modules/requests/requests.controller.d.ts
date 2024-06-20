import { RequestsService } from './requests.service';
import { Request } from 'express';
import { addRequestDTO } from 'src/dto/requests/addRequest.dto';
import { addAvailabilityDTO } from 'src/dto/requests/addAvailability.dto';
import { updateAvailbilityDTO } from 'src/dto/requests/updateAvailability.dto';
export declare class RequestsController {
    private _reqSrv;
    constructor(_reqSrv: RequestsService);
    addRequest(requestInfo: addRequestDTO, request: Request): Promise<string | {
        message: string;
    }>;
    showRequests(request: Request): Promise<any>;
    getRequestDetails(request: Request, requestID: number): Promise<any>;
    getProviderAvailability(request: Request): Promise<any>;
    addAvailability(availabilityInfo: addAvailabilityDTO, request: Request): Promise<{
        data: {};
        message: string;
    }>;
    updateAvailbility(availabilityInfo: updateAvailbilityDTO, requestID: number, request: Request): Promise<{
        data: {};
        message: string;
    }>;
    getNotifications(request: Request): Promise<any>;
    getProviderRequestDetails(requestID: number, request: Request): Promise<any>;
    getProvidersAgainstRequest(request: Request): Promise<any>;
    getRequestOfProvider(providerID: number, request: Request): Promise<any>;
    getProviderScheduleAgainstRequest(requestID: number, providerID: number, request: Request): Promise<any>;
    updateProviderAvailability(availabilityInfo: updateAvailbilityDTO, requestID: number, providerID: number, request: Request): Promise<{
        data: {};
        message: string;
    }>;
    getProviderSchedule(providerID: number, request: Request): Promise<any>;
}
