import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LengthForIdentificationKeyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.length!=20) {
      throw new BadRequestException('Invalid parameter. Expected a 20-character code.');
    }

    return value;
  }
}
