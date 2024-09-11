import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { responseData } from 'src/dto/responseData.dto';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map(data => {
                if(typeof data == 'object'){
                    return new responseData(data);
                }else{
                    let response = new responseData({});
                    response.success = false;
                    response.message = data;
                    return response;
                }
            }),
        );
    }
}