"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let QueryService = class QueryService {
    async selectSingle(query, data = [], isSp = false) {
        const _data = (await (0, typeorm_1.getManager)().query(query, [...data]))[0];
        if (isSp == true) {
            return _data[0];
        }
        return _data;
    }
    async select(query, data = [], isSp = false) {
        const _data = await (0, typeorm_1.getManager)().query(query, [...data]);
        if (isSp == true) {
            if (_data.length > 2) {
                let d = [];
                for (let i = 0; i < _data.length; i++) {
                    const el = _data[i];
                    if (Array.isArray(el))
                        d.push(el);
                }
                return d;
            }
            return _data[0];
        }
        return _data;
    }
    async insertUpdatDelete(query, data, isSp = false) {
        if (query && data) {
            const _data = await (0, typeorm_1.getManager)().query(query, [...data]);
            return _data;
        }
    }
};
QueryService = __decorate([
    (0, common_1.Injectable)()
], QueryService);
exports.QueryService = QueryService;
//# sourceMappingURL=query.service.js.map