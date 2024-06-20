import { TypeOrmModuleOptions } from "@nestjs/typeorm";
export declare class ConfigService {
    constructor();
    get nodeEnv(): string;
    get(key: string): string;
    get typeOrmConfig(): TypeOrmModuleOptions;
    jwtKey(key: string): string;
    getNumber(key: string): number;
}
