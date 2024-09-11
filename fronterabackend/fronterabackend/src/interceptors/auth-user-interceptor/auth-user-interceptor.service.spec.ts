import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserInterceptorService } from './auth-user-interceptor.service';

describe('AuthUserInterceptorService', () => {
  let service: AuthUserInterceptorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthUserInterceptorService],
    }).compile();

    service = module.get<AuthUserInterceptorService>(AuthUserInterceptorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
