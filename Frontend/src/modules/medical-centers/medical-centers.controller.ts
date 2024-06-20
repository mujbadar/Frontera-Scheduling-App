import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuardJWT } from "src/guards/auth.guard";
import { AuthUserInterceptorService } from "src/interceptors/auth-user-interceptor/auth-user-interceptor.service";
import { MedicalCentersService } from "./medical-centers.service";
import {
  medicalCenterDTO,
  updateMedicalCenterDTO,
} from "src/dto/medical-center/add-center";
import { MedicalCalender, MedicalCenterListingFilter } from "src/dto/medical-center/calender-details";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("medical-centers")
@UseGuards(AuthGuardJWT)
@UseInterceptors(AuthUserInterceptorService)
@ApiBearerAuth()
@ApiTags("Medical Centers")
export class MedicalCentersController {
  constructor(private _medSrv: MedicalCentersService) {}

  @Post("add")
  async addMedicalCenter(
    @Body() medicalCenterInfo: medicalCenterDTO,
    @Req() request: Request
  ) {
    return this._medSrv.addMedicalCenter(medicalCenterInfo, request);
  }

  @Post("update/:centerID")
  async updateMedicalCenter(
    @Body() medicalCenterInfo: updateMedicalCenterDTO,
    @Param("centerID") centerID: number,
    @Req() request: Request
  ) {
    return this._medSrv.updateMedicalCenter(
      medicalCenterInfo,
      request,
      centerID
    );
  }

  @Post("delete/:centerID")
  async deleteMedicalCenters(
    @Param("centerID") centerID: number,
    @Req() request: Request
  ) {
    return this._medSrv.deleteMedicalCenters(centerID, request);
  }

  @Get("get")
  @ApiQuery({name:"region",required:true, description:'Enter 0 for all region else enter specific region id'})
  @ApiQuery({name:"page",required:true, description:'Start from 0'})
  @ApiQuery({name:"limit",required:true, description:'Keep it 10'})
  async getMedicalCenterListing(@Req() request: Request,@Query() params: MedicalCenterListingFilter) {
    return await this._medSrv.getMedicalCenterListing(request,params);
  }

  @Get("get/:medicalCenterID")
  @ApiParam({name:"medicalCenterID",required:true})
  async getMedicalCenterInfo(@Param('medicalCenterID') medicalCenterID:number,@Req() request: Request) {
    return await this._medSrv.getMedicalCenterInfo(medicalCenterID,request);
  }

  @Get("calender/:medicalCenterID")
  @ApiParam({name:"medicalCenterID",required:true})
  @ApiQuery({name:"month",required:true, description:'2024-03-25'})
  async getMedicalCenterCalender(@Param('medicalCenterID') medicalCenterID:number,@Req() request: Request,@Query() params: MedicalCalender) {
    return await this._medSrv.getMedicalCenterCalender(medicalCenterID,request,params);
  }

  @Get("calender/details/:medicalCenterID")
  @ApiParam({name:"medicalCenterID",required:true})
  @ApiQuery({name:"month",required:true, description:'2024-03-25'})
  async getMedicalCenterMonthListing(@Param('medicalCenterID') medicalCenterID:number,@Req() request: Request,@Query() params: MedicalCalender) {
    return await this._medSrv.getMedicalCenterMonthListing(medicalCenterID,request,params);
  }

  @Get("region")
  async getRegions(@Req() request: Request) {
    return await this._medSrv.getRegions(request);
  }
  
  @Post('import-csv-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
    async importCsvData(@Req() request: Request,@UploadedFile() file: Express.Multer.File) {
        return await  this._medSrv.importCsvData(file.buffer); 
    }
}
