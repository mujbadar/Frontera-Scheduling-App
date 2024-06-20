import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class ErrorFilter implements ExceptionFilter {
    reflector: Reflector;
    constructor(reflector: Reflector);
    catch(exception: any, host: ArgumentsHost): void;
}
