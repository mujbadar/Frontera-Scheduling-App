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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuardJWT } from "src/guards/auth.guard";
import { AuthUserInterceptorService } from "src/interceptors/auth-user-interceptor/auth-user-interceptor.service";
import { ProvidersService } from "./providers.service";
import { addProviderDTO } from "src/dto/provider/addProvider";
import { Request } from "express";
import { ProviderListingFilter } from "src/dto/provider/providerListingFilter";
import { MedicalCalender } from "src/dto/medical-center/calender-details";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("providers")
@UseGuards(AuthGuardJWT)
@UseInterceptors(AuthUserInterceptorService)
@ApiBearerAuth()
@ApiTags("Providers")
export class ProvidersController {
  constructor(private _providerSrv: ProvidersService) {}

  @Post("add")
  async addProvider(
    @Body() providerInfo: addProviderDTO,
    @Req() request: Request
  ) {
    return this._providerSrv.addProvider(providerInfo, request);
  }

  @Post("update/:providerID")
  @ApiParam({ name: "providerID", required: true })
  async updateProvider(
    @Body() providerInfo: addProviderDTO,
    @Param("providerID") providerID: number,
    @Req() request: Request
  ) {
    return this._providerSrv.updateProvider(providerInfo, providerID, request);
  }

  @Post("delete/:providerID")
  @ApiParam({ name: "providerID", required: true })
  async deleteProvider(
    @Param("providerID") providerID: number,
    @Req() request: Request
  ) {
    return this._providerSrv.deleteProvider(providerID, request);
  }

  @Get("get")
  @ApiQuery({
    name: "region",
    required: true,
    description: "Enter 0 for all region else enter specific region id",
  })
  @ApiQuery({ name: "page", required: true, description: "Start from 0" })
  @ApiQuery({ name: "limit", required: true, description: "Keep it 10" })
  async getProviderListing(
    @Req() request: Request,
    @Query() params: ProviderListingFilter
  ) {
    return await this._providerSrv.getProviderListing(request, params);
  }

  @Get("specializations")
  async getSpecializations(@Req() request: Request) {
    return await this._providerSrv.getSpezializations(request);
  }

  @Get("med-centers")
  async getMedicalCenters(@Req() request: Request) {
    return await this._providerSrv.getMedicalCenters(request);
  }

  @Get("rooms/:medicalCenterID")
  @ApiParam({ name: "medicalCenterID", required: true })
  async getRooms(
    @Req() request: Request,
    @Param("medicalCenterID") medicalCenterID: number
  ) {
    return await this._providerSrv.getRooms(medicalCenterID, request);
  }

  @Get("rooms/:medicalCenterID/:specializationID")
  @ApiParam({ name: "medicalCenterID", required: true })
  @ApiParam({ name: "specializationID", required: true })
  async roomOfMedAndSpeclization(
    @Req() request: Request,
    @Param("specializationID") specializationID: number,
    @Param("medicalCenterID") medicalCenterID: number
  ) {
    return await this._providerSrv.roomOfMedAndSpeclization(
      medicalCenterID,
      specializationID,
      request
    );
  }

  @Get("get/:providerID")
  @ApiParam({ name: "providerID", required: true })
  async getProviderInfo(
    @Param("providerID") providerID: number,
    @Req() request: Request
  ) {
    return await this._providerSrv.getProviderInfo(providerID, request);
  }

  @Get("get/calender/:providerID")
  @ApiParam({ name: "providerID", required: true })
  @ApiQuery({ name: "month", required: true, description: "2024-03-25" })
  async getProviderCalender(
    @Param("providerID") providerID: number,
    @Req() request: Request,
    @Query() params: MedicalCalender
  ) {
    console.log("request for calender data");
    return await this._providerSrv.getProviderCalender(
      providerID,
      request,
      params
    );
  }

  @Get("calender/details/:providerID")
  @ApiParam({ name: "providerID", required: true })
  @ApiQuery({ name: "month", required: true, description: "2024-03-25" })
  async getProviderCalenderMonthListing(
    @Param("providerID") providerID: number,
    @Req() request: Request,
    @Query() params: MedicalCalender
  ) {
    return await this._providerSrv.getProviderCalenderMonthListing(
      providerID,
      request,
      params
    );
  }

    @Post('import-csv-data')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: 'multipart/form-data', 
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
        return await  this._providerSrv.importCsvData(file.buffer); 
    }


}
