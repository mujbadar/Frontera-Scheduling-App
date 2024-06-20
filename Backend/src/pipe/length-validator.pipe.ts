import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LengthValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const hexCodeRegex = /^[0-9a-fA-F]{20}$/;

    if (!hexCodeRegex.test(value.key) || value.key.length!=20) {
      throw new BadRequestException('Invalid parameter. Expected a 20-character hexadecimal code.');
    }

    return value;
  }
}
