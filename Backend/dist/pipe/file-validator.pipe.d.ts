/// <reference types="multer" />
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class FileValidatorPipe implements PipeTransform {
    private readonly allowedFileTypes;
    transform(value: any, metadata: ArgumentMetadata): Express.Multer.File;
}
