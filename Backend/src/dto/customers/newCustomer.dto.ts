import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class newCustomerDTO{

    @ApiProperty()
    @IsNotEmpty()
    companyName:string;

    @ApiProperty()
    @IsNotEmpty()
    contactPerson:string;

    @ApiProperty()
    @IsOptional()
    phone:string;

    @ApiProperty()
    @IsOptional()
    mail:string;

    @ApiProperty()
    @IsOptional()
    address:string;

    @ApiProperty()
    @IsOptional()
    notes:string;
}