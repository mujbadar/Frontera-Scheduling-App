import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class appManagementDTO{

    @ApiProperty()
    @IsNotEmpty()
    appID:string;

    @ApiProperty()
    @IsNotEmpty()
    appName:string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmpty()
    exeLink:any;
 
}