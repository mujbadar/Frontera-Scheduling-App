import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ProviderListingFilter{
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