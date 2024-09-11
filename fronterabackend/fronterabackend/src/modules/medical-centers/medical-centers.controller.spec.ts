import { Test, TestingModule } from '@nestjs/testing';
import { MedicalCentersController } from './medical-centers.controller';

describe('MedicalCentersController', () => {
  let controller: MedicalCentersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalCentersController],
    }).compile();

    controller = module.get<MedicalCentersController>(MedicalCentersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
