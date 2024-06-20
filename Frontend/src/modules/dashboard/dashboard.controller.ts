import { DashboardService } from './dashboard.service';
import { Body, Controller, Get, Req, UseGuards, UseInterceptors, Post, UploadedFile, Res, UploadedFiles, Param, Query } from '@nestjs/common';
import { AuthGuardJWT } from 'src/guards/auth.guard';
import { Request,Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthUserInterceptorService } from 'src/interceptors/auth-user-interceptor/auth-user-interceptor.service';
import { DashboardCalenderDetailFilter, DashboardCalenderExport, MedicalCalender } from 'src/dto/medical-center/calender-details';
@Controller('dashboard')
@UseGuards(AuthGuardJWT)
@UseInterceptors(AuthUserInterceptorService)
@ApiBearerAuth()
@ApiTags('Dashbaord')

export class DashboardController {

    constructor(private _dashboardService:DashboardService){}
 
    @Get('dummy-csv-customers')
    async exportCSV(@Res() res: Response) {
        return await  this._dashboardService.generateCSV(res); 
    }

    @Get('calender')
    @ApiQuery({name:"month",required:true, description:'2024-03-25'})
    async calenderStats(@Req() request: Request,@Query() params: MedicalCalender) {
      return await  this._dashboardService.calenderStats(request,params); 
    }
 

    @Get('calender/details')
    @ApiQuery({name:"region",required:true, description:'Enter 0 for all region else enter specific region id'})
    @ApiQuery({name:"month",required:true, description:'2024-03-25'})
    async calenderDetailList(@Req() request: Request,@Query() params: DashboardCalenderDetailFilter) {
      return await  this._dashboardService.calenderDetailList(request,params); 
    }

    @Get('export-calender')
    @ApiQuery({name:"month",required:true, description:'2024-03-25'})
    async exportCalenderData(@Req() request: Request,@Query() params: DashboardCalenderExport) {
      return await  this._dashboardService.exportCalenderData(request,params); 
    }
 


 


}
