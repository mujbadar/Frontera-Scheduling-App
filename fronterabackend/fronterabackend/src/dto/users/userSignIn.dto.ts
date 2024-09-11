import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class signInDTO{

    @ApiProperty()
    @IsNotEmpty()
    email:string;

    @ApiProperty()
    @IsNotEmpty()
    password:string;
}

export class resetPasswordDTO{
    
    @ApiProperty()
    @IsNotEmpty()
    token:string;
    
    @ApiProperty()
    @IsNotEmpty()
    password:string;
}
