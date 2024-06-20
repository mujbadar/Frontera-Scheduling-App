/// <reference types="multer" />
import { ConfigService } from 'src/shared/services/config/config.service';
export declare class FileService {
    private configService;
    constructor(configService: ConfigService);
    private containerName;
    private getBlobServiceInstance;
    private getBlobClient;
    uploadFile(file: Express.Multer.File, containerName: string): Promise<string>;
}
