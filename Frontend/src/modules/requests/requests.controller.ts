import { Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuardJWT } from 'src/guards/auth.guard';
import { AuthUserInterceptorService } from 'src/interceptors/auth-user-interceptor/auth-user-interceptor.service';
import { RequestsService } from './requests.service';
import {Request} from 'express'
import { addRequestDTO } from 'src/dto/requests/addRequest.dto';
import { addAvailabilityDTO } from 'src/dto/requests/addAvailability.dto';
import { updateAvailbilityDTO } from 'src/dto/requests/updateAvailability.dto';

@Controller('requests')
@UseGuards(AuthGuardJWT)
@UseInterceptors(AuthUserInterceptorService)
@ApiBearerAuth()
@ApiTags('Requests')
export class RequestsController {

    constructor(private _reqSrv:RequestsService){}

    @Post("add")
    async addRequest(@Body() requestInfo:addRequestDTO,@Req() request: Request ){
        return this._reqSrv.addRequest(requestInfo,request)
    }

    @Get("listing")
    async showRequests(@Req() request: Request ){
        return this._reqSrv.showRequests(request)
    }

    @Get("listing/:requestID")
    @ApiParam({name:"requestID",required:true})
    async getRequestDetails(@Req() request: Request,@Param('requestID') requestID:number ){
        return this._reqSrv.getRequestDetails(requestID,request)
    }

    @Get("provider-availability")
    async getProviderAvailability(@Req() request: Request){
        return this._reqSrv.getProviderAvailability(request)
    }


    @Post("availability/add")
    async addAvailability(@Body() availabilityInfo:addAvailabilityDTO,@Req() request: Request ){
        return this._reqSrv.addAvailability(availabilityInfo,request)
    }

    @Post("availability/update/:requestID")
    @ApiParam({name:"requestID",required:true})
    async updateAvailbility(@Body() availabilityInfo:updateAvailbilityDTO,@Param('requestID') requestID:number,@Req() request: Request ){
        return this._reqSrv.updateAvailability(availabilityInfo,requestID,request)
    }

    @Get("notifications")
    async getNotifications(@Req() request: Request ){
        return this._reqSrv.getNotifications(request)
    }

    @Get("fetch-request-details/:requestID/")
    @ApiParam({ name: "requestID", required: true })
    async getProviderRequestDetails(
        @Param("requestID") requestID: number,
        @Req() request: Request ){
        return this._reqSrv.getProviderRequestDetails(requestID,request)
    }

    @Get("providers")
    async getProvidersAgainstRequest(
        @Req() request: Request ){
        return this._reqSrv.getProvidersAgainstRequest(request)
    }

    @Get("provider/:providerID")
    @ApiParam({ name: "providerID", required: true })
    async getRequestOfProvider(
        @Param("providerID") providerID: number,
        @Req() request: Request ){
        return this._reqSrv.getRequestOfProvider(providerID,request)
    }


    @Get("provider-details/:requestID/:providerID")
    @ApiParam({ name: "requestID", required: true })
    @ApiParam({ name: "providerID", required: true })
    async getProviderScheduleAgainstRequest(
        @Param("requestID") requestID: number,
        @Param("providerID") providerID: number,
        @Req() request: Request ){
        return this._reqSrv.getProviderScheduleAgainstRequest(providerID,requestID,request)
    }



    @Post("update-provider-availability/:requestID/:providerID")
    @ApiParam({name:"requestID",required:true})
    @ApiParam({name:"providerID",required:true})
    async updateProviderAvailability(@Body() availabilityInfo:updateAvailbilityDTO,
    @Param('requestID') requestID:number,
    @Param('providerID') providerID:number,
    @Req() request: Request ){
        return this._reqSrv.updateProviderAvailability(availabilityInfo,requestID,providerID,request)
    }


    @Get("provider-schedule/:providerID")
    @ApiParam({ name: "providerID", required: true })
    async getProviderSchedule(
        @Param("providerID") providerID: number,
        @Req() request: Request ){
        return this._reqSrv.getProviderSchedule(providerID,request)
    }

}
