import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class addRequestDTO {
    @ApiProperty()
    @IsOptional()
    medicalCenterID:number;

    @ApiProperty()
    @IsOptional()
    providerID:number;

    @ApiProperty()
    @IsNotEmpty()
    startDate:string;

    @ApiProperty()
    @IsNotEmpty()
    endDate:string;

    @ApiProperty()
    @IsNotEmpty()
    deadline:string;

    // @ApiProperty()
    // @IsNotEmpty()
    // emailText:string;

    @ApiProperty()
    @IsNotEmpty()
    weekendsOff:boolean;

    @ApiProperty()
    @IsNotEmpty()
    holidayDates: string[];
}
