import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config/config.service';
import { FileService } from './services/files/files.service';
import { QueryService } from './services/query/query.service';
import { EmailService } from './services/email/email.service';

const providers = [
    ConfigService,
    QueryService,
    FileService,
    EmailService
];
@Global()
@Module({
    providers: [ConfigService,QueryService,FileService,EmailService],
    exports: [...providers],
})
export class SharedModule {}
