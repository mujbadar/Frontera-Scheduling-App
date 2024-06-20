import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class AuthUserInterceptorService implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
