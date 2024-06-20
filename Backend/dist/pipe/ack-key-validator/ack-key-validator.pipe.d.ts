import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class AckKeyValidatorPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
