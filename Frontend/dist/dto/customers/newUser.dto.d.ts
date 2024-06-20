declare class AccessObjectDto {
    appID: string;
    isEnabled: boolean;
    isTrial: boolean;
    startDate: string;
    endDate: string;
    noOfRuns: number;
}
export declare class newUserDTO {
    userName: string;
    notes: string;
    PCID: string;
    access: AccessObjectDto[];
}
export {};
