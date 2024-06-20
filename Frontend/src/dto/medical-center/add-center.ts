import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class medicalCenterDTO{

    @ApiProperty()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsNotEmpty()
    regionID:number;

    @ApiProperty()
    @IsNotEmpty()
    address:string;

    @ApiProperty()
    @IsNotEmpty()
    poc:string;

    @ApiProperty()
    @IsNotEmpty()
    contact:string;

    @ApiProperty()
    @IsNotEmpty()
    email:string;

    @ApiProperty({ type: () => medicalRoomsDTO, isArray: true }) 
    @Type(() => medicalRoomsDTO) 
    @IsNotEmpty()
    rooms: medicalRoomsDTO[];
}

export class updateMedicalCenterDTO{

    @ApiProperty()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsNotEmpty()
    regionID:number;

    @ApiProperty()
    @IsNotEmpty()
    address:string;

    @ApiProperty()
    @IsNotEmpty()
    poc:string;

    @ApiProperty()
    @IsNotEmpty()
    contact:string;

    @ApiProperty()
    @IsNotEmpty()
    email:string;

    @ApiProperty({ type: () => updateMedicalRoomsDTO, isArray: true }) 
    @Type(() => updateMedicalRoomsDTO) 
    @IsNotEmpty()
    rooms: updateMedicalRoomsDTO[];
}

export class medicalRoomsDTO{

    @ApiProperty()
    @IsNotEmpty()
    name:string;


    @ApiProperty()
    @IsNotEmpty()
    specializationID:number;
}

export class updateMedicalRoomsDTO{
    @ApiProperty()
    @IsOptional()
    id:number;

    @ApiProperty()
    @IsOptional()
    isDeleted:boolean;

    @ApiProperty()
    @IsNotEmpty()
    name:string;


    @ApiProperty()
    @IsNotEmpty()
    specializationID:number;
}