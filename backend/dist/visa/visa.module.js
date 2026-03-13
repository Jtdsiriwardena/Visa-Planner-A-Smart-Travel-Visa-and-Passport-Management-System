"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const visa_service_1 = require("./visa.service");
const visa_controller_1 = require("./visa.controller");
const passport_entity_1 = require("../passport/passport.entity");
let VisaModule = class VisaModule {
};
exports.VisaModule = VisaModule;
exports.VisaModule = VisaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([passport_entity_1.UserPassport])],
        providers: [visa_service_1.VisaService],
        controllers: [visa_controller_1.VisaController],
    })
], VisaModule);
//# sourceMappingURL=visa.module.js.map