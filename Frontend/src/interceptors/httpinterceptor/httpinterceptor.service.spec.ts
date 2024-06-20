import { Test, TestingModule } from '@nestjs/testing';
import { HttpinterceptorService } from './httpinterceptor.service';

describe('HttpinterceptorService', () => {
  let service: HttpinterceptorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpinterceptorService],
    }).compile();

    service = module.get<HttpinterceptorService>(HttpinterceptorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
