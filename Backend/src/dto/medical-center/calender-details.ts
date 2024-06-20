import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class MedicalCalender{
    @ApiProperty()
    @IsNotEmpty()
    month:string;
}


export class MedicalCenterListingFilter{
    @ApiProperty()
    @IsNotEmpty()
    region:number;

    @ApiProperty()
    @IsNotEmpty()
    page:number;

    @ApiProperty()
    @IsNotEmpty()
    limit:number;
}

export class DashboardCalenderDetailFilter{
    @ApiProperty()
    @IsNotEmpty()
    region:number;

    @ApiProperty()
    @IsNotEmpty()
    month:string;
}

export class DashboardCalenderExport{

    @ApiProperty()
    @IsNotEmpty()
    month:string;
}