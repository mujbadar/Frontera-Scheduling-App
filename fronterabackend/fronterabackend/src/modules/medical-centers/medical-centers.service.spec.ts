import { Test, TestingModule } from '@nestjs/testing';
import { MedicalCentersService } from './medical-centers.service';

describe('MedicalCentersService', () => {
  let service: MedicalCentersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalCentersService],
    }).compile();

    service = module.get<MedicalCentersService>(MedicalCentersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
