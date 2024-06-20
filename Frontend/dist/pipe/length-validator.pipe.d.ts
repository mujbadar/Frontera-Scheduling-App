import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class LengthValidatorPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
