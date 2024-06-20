import { AuthModule } from './../auth/auth.module';
import { HttpModule, Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports:[AuthModule,HttpModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
