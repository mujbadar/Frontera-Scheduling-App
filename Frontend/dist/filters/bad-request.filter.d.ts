import { ExceptionFilter, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class HttpExceptionFilter implements ExceptionFilter {
    reflector: Reflector;
    constructor(reflector: Reflector);
    catch(exception: BadRequestException, host: ArgumentsHost): void;
    private _validationFilter;
}
