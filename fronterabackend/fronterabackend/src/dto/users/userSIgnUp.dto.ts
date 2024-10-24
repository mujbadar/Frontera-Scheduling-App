import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class signUpDTO{
    @ApiProperty()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsNotEmpty()
    email:string;

    @ApiProperty()
    @IsNotEmpty()
    password:string;

}

export class passwordResetLink{
    resetUrl:string='';
    recieverEmail: string='';
    recieverName: string='';
}

export class signUpEmail{
    password:string='';
    recieverEmail: string='';
    recieverName: string='';
}

export class updateAvailbilityEmail{
    deadline:string='';
    login_url:string='';
    recieverEmail: string='';
    providerName: string='';
}