import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AckKeyValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const hexCodeRegex = /^[0-9a-fA-F]{18}$/;

    if (!hexCodeRegex.test(value.ackPcidCode) || value.ackPcidCode.length!=18) {
      throw new BadRequestException('Invalid parameter. Expected a 18-character hexadecimal code.');
    }

    return value;
  }
}
