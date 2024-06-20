"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const config_service_1 = require("../config/config.service");
const common_1 = require("@nestjs/common");
const storage_blob_1 = require("@azure/storage-blob");
const uuidv4_1 = require("uuidv4");
let FileService = class FileService {
    constructor(configService) {
        this.configService = configService;
    }
    async getBlobServiceInstance() {
        const connectionString = this.configService.get('CONNECTION_STRING');
        const blobClientService = await storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        return blobClientService;
    }
    async getBlobClient(imageName) {
        const blobService = await this.getBlobServiceInstance();
        const containerName = this.containerName;
        const containerClient = blobService.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(imageName);
        return blockBlobClient;
    }
    async uploadFile(file, containerName) {
        this.containerName = containerName;
        const extension = file.originalname.split('.').pop();
        const file_name = (0, uuidv4_1.uuid)() + '.' + extension;
        const blockBlobClient = await this.getBlobClient(file_name);
        const fileUrl = blockBlobClient.url;
        await blockBlobClient.uploadData(file.buffer);
        return fileUrl;
    }
};
FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=files.service.js.map