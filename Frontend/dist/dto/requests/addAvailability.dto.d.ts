export declare class addAvailabilityDTO {
    requestID: string;
    availability: availabilityCycle[];
    customAvailability: customAvailability[];
}
export declare class availabilityCycle {
    startDate: string;
    endDate: string;
    shiftID: number;
}
export declare class customAvailability {
    date: string;
    shiftID: number;
}
