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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const passport_entity_1 = require("./passport.entity");
let PassportService = class PassportService {
    passportRepo;
    constructor(passportRepo) {
        this.passportRepo = passportRepo;
    }
    findByUser(userId) {
        return this.passportRepo.find({ where: { user: { id: userId } } });
    }
    async create(userId, data) {
        const passport = this.passportRepo.create({
            country_code: data.country_code,
            expiry_date: data.expiry_date,
            user: { id: userId },
        });
        return this.passportRepo.save(passport);
    }
    async update(userId, id, data) {
        const passport = await this.passportRepo.findOne({
            where: { id, user: { id: userId } },
        });
        if (!passport)
            throw new common_1.NotFoundException('Passport not found');
        Object.assign(passport, data);
        return this.passportRepo.save(passport);
    }
    async delete(userId, id) {
        const passport = await this.passportRepo.findOne({
            where: { id, user: { id: userId } },
        });
        if (!passport)
            throw new common_1.NotFoundException('Passport not found');
        return this.passportRepo.remove(passport);
    }
};
exports.PassportService = PassportService;
exports.PassportService = PassportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(passport_entity_1.UserPassport)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], PassportService);
//# sourceMappingURL=passport.service.js.map