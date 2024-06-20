export declare class medicalCenterDTO {
    name: string;
    regionID: number;
    address: string;
    poc: string;
    contact: string;
    email: string;
    rooms: medicalRoomsDTO[];
}
export declare class updateMedicalCenterDTO {
    name: string;
    regionID: number;
    address: string;
    poc: string;
    contact: string;
    email: string;
    rooms: updateMedicalRoomsDTO[];
}
export declare class medicalRoomsDTO {
    name: string;
    specializationID: number;
}
export declare class updateMedicalRoomsDTO {
    id: number;
    isDeleted: boolean;
    name: string;
    specializationID: number;
}
