import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, Matches } from "class-validator";

export class ackCheckDTO{

    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^[0-9a-fA-F]{20}$/, { message: 'PCID must be a 20-digit hexadecimal code' })
    pcid: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsIn(["FFFF", "0000"], { message: 'ackHexCode must be either "FFFF" or "0000"' })
    ackHexCode: string;
}