import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class newAccessUserDTO{

    @ApiProperty()
    @IsNotEmpty()
    userName:string;

    @ApiProperty()
    @IsNotEmpty()
    password:string;
 
}