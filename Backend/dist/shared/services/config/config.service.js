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
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
let ConfigService = class ConfigService {
    constructor() {
        const nodeEnv = this.nodeEnv;
        dotenv.config({
            path: `.${nodeEnv}.env`,
        });
        for (const envName of Object.keys(process.env)) {
            process.env[envName] = process.env[envName].replace(/\\n/g, "\n");
        }
    }
    get nodeEnv() {
        return this.get("NODE_ENV") || "development";
    }
    get(key) {
        return process.env[key];
    }
    get typeOrmConfig() {
        let entities = [__dirname + "/../../modules/**/*.entity{.ts,.js}"];
        let migrations = [__dirname + "/../../migrations/*{.ts,.js}"];
        if (module.hot) {
            const entityContext = require.context("./../../modules", true, /\.entity\.ts$/);
            entities = entityContext.keys().map((id) => {
                const entityModule = entityContext(id);
                const [entity] = Object.values(entityModule);
                return entity;
            });
            const migrationContext = require.context("./../../migrations", false, /\.ts$/);
            migrations = migrationContext.keys().map((id) => {
                const migrationModule = migrationContext(id);
                const [migration] = Object.values(migrationModule);
                return migration;
            });
        }
        return {
            entities,
            migrations,
            keepConnectionAlive: true,
            type: "mysql",
            host: this.get("MYSQL_HOST"),
            username: this.get("MYSQL_USERNAME"),
            password: this.get("MYSQL_PASSWORD"),
            database: this.get("MYSQL_DATABASE"),
            synchronize: false,
            logging: this.nodeEnv === "development",
            timezone: "Z",
            connectTimeout: 10000 * 5,
        };
    }
    jwtKey(key) {
        return fs
            .readFileSync(path.resolve(this.get(key)), "utf8")
            .replace(/\\n/gm, "\n");
    }
    getNumber(key) {
        return Number(this.get(key));
    }
};
ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map