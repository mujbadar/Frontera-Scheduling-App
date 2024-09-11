import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

class AccessObjectDto {
    @ApiProperty()
    @IsNotEmpty()
    appID: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isEnabled: boolean;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isTrial: boolean;
  
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    startDate: string;
  
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    endDate: string;
  
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    noOfRuns: number;
  }
  
export class newUserDTO{

    @ApiProperty()
    @IsNotEmpty()
    userName:string;

    @ApiProperty()
    @IsOptional()
    notes:string;

    @ApiProperty()
    @IsOptional()
    PCID:string;

    @ApiProperty({ type: [AccessObjectDto] })
    @IsNotEmpty()
    access: AccessObjectDto[];

}
