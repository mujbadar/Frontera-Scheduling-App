import { Module } from '@nestjs/common';
import { MedicalCentersController } from './medical-centers.controller';
import { MedicalCentersService } from './medical-centers.service';

@Module({
  controllers: [MedicalCentersController],
  providers: [MedicalCentersService]
})
export class MedicalCentersModule {}
