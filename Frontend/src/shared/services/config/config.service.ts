import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class ConfigService {
  constructor() {
    const nodeEnv = this.nodeEnv;
    dotenv.config({
      path: `.${nodeEnv}.env`,
    });

    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, "\n");
    }
  }

  get nodeEnv(): string {
    return this.get("NODE_ENV") || "development";
  }
  public get(key: string): string {
    return process.env[key];
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + "/../../modules/**/*.entity{.ts,.js}"];
    let migrations = [__dirname + "/../../migrations/*{.ts,.js}"];

    if ((module as any).hot) {
      const entityContext = (require as any).context(
        "./../../modules",
        true,
        /\.entity\.ts$/
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
      const migrationContext = (require as any).context(
        "./../../migrations",
        false,
        /\.ts$/
      );
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
      // port: this.getNumber('MYSQL_PORT'),
      username: this.get("MYSQL_USERNAME"),
      password: this.get("MYSQL_PASSWORD"),
      database: this.get("MYSQL_DATABASE"),
      synchronize: false,
      logging: this.nodeEnv === "development",
      timezone: "Z",
      connectTimeout: 10000 * 5,
    };
  }

  public jwtKey(key: string): string {
    return fs
      .readFileSync(path.resolve(this.get(key)), "utf8")
      .replace(/\\n/gm, "\n");
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }
}
