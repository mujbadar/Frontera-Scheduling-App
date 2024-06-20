import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileValidatorPipe implements PipeTransform {
  private readonly allowedFileTypes = ['application/x-msdownload', 'application/x-ms-dos-executable'];

  transform(value: any, metadata: ArgumentMetadata) {
    const file: Express.Multer.File = value;
    const { mimetype } = file;

    if (!this.allowedFileTypes.includes(mimetype)) {
      throw new BadRequestException('Only EXE files are allowed');
    }

    return file;
  }
}
