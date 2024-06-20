import { DashboardModule } from './modules/dashboard/dashboard.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './shared/services/config/config.service';
import { QueryService } from './shared/services/query/query.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpInterceptor } from './interceptors/httpinterceptor/http.interceptor';
import { MedicalCentersModule } from './modules/medical-centers/medical-centers.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { RequestsModule } from './modules/requests/requests.module';


@Module({
  imports: [
    DashboardModule,
    MedicalCentersModule,
    ProvidersModule,
    RequestsModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule,],
      useFactory: (configService: ConfigService) =>
        configService.typeOrmConfig,
      inject: [ConfigService],
    }),  ],
  controllers: [AppController],
  providers:[AppService, QueryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    }],
})
export class AppModule {}
