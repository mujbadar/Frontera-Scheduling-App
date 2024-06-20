import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class QueryFailedFilter implements ExceptionFilter {
    reflector: Reflector;
    constructor(reflector: Reflector);
    catch(exception: any, host: ArgumentsHost): void;
}
