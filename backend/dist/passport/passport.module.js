"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const passport_service_1 = require("./passport.service");
const passport_controller_1 = require("./passport.controller");
const passport_entity_1 = require("./passport.entity");
let PassportModule = class PassportModule {
};
exports.PassportModule = PassportModule;
exports.PassportModule = PassportModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([passport_entity_1.UserPassport])],
        providers: [passport_service_1.PassportService],
        controllers: [passport_controller_1.PassportController],
        exports: [passport_service_1.PassportService],
    })
], PassportModule);
//# sourceMappingURL=passport.module.js.map