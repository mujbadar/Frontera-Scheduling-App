import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class addAvailabilityDTO {
    @ApiProperty()
    @IsNotEmpty()
    requestID: string;

    @ApiProperty({ type: () => availabilityCycle, isArray: true })
    @Type(() => availabilityCycle)
    @IsNotEmpty()
    availability: availabilityCycle[];

    @ApiProperty({ type: () => customAvailability, isArray: true })
    @Type(() => customAvailability)
    @IsOptional()
    customAvailability: customAvailability[];
}

export class availabilityCycle {
    @ApiProperty()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty()
    @IsNotEmpty()
    endDate: string;

    @ApiProperty()
    @IsNotEmpty()
    shiftID: number;
}

export class customAvailability {
    @ApiProperty()
    @IsNotEmpty()
    date: string;

    @ApiProperty()
    @IsNotEmpty()
    shiftID: number;
}
