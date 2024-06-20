export declare class addProviderDTO {
    name: string;
    specializationID: number;
    medicalCenterID: number;
    email: string;
    contact: string;
    preferrRoomID: number;
    availability: availabilityTimings[];
}
declare enum ShiftType {
    Morning = "MORNING",
    Afternoon = "AFTERNOON",
    Full = "FULL"
}
export declare class availabilityTimings {
    shiftType: ShiftType;
    shiftFromTime: string;
    shiftToTime: string;
}
export {};
