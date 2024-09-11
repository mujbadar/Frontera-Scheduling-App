import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class addProviderDTO{

    @ApiProperty()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsNotEmpty()
    specializationID:number;

    @ApiProperty()
    @IsNotEmpty()
    medicalCenterID:number;

    @ApiProperty()
    @IsNotEmpty()
    email:string;

    @ApiProperty()
    @IsNotEmpty()
    contact:string;

    @ApiProperty()
    @IsOptional()
    preferrRoomID:number;

    @ApiProperty({ type: () => availabilityTimings, isArray: true }) 
    @Type(() => availabilityTimings) 
    @IsNotEmpty()
    availability: availabilityTimings[];
}
enum ShiftType {
    Morning = 'MORNING',
    Afternoon = 'AFTERNOON',
    Full = 'FULL'
}
export class availabilityTimings{

    @ApiProperty({ enum: ShiftType})
    @IsNotEmpty()
    shiftType:ShiftType;

    @ApiProperty()
    @IsNotEmpty()
    shiftFromTime:string;

    @ApiProperty()
    @IsNotEmpty()
    shiftToTime:string;
}

