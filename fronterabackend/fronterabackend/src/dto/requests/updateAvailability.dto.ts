import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";

export class updateAvailbilityDTO {

    @ApiProperty({ type: () => customAvailability, isArray: true }) 
    @Type(() => customAvailability) 
    @IsOptional()
    customAvailability: customAvailability[];

}



export class customAvailability{

    @ApiProperty()
    @IsNotEmpty()
    id:number;

    @ApiProperty()
    @IsNotEmpty()
    date:string;

    @ApiProperty()
    @IsNotEmpty()
    shiftID: number;

    @ApiProperty()
    @IsNotEmpty()
    isDeleted: boolean;
}