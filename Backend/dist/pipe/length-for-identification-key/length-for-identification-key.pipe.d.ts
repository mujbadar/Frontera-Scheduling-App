import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class LengthForIdentificationKeyPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
