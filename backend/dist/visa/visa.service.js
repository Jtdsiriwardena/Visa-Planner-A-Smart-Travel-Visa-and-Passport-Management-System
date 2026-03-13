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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const passport_entity_1 = require("../passport/passport.entity");
const axios_1 = __importDefault(require("axios"));
let VisaService = class VisaService {
    passportRepo;
    constructor(passportRepo) {
        this.passportRepo = passportRepo;
    }
    async checkVisa(userId, dto) {
        const { passport_id, country_code } = dto;
        const passport = await this.passportRepo.findOne({
            where: { id: passport_id, user: { id: userId } },
        });
        if (!passport) {
            throw new common_1.NotFoundException('Passport not found');
        }
        const passportCountry = passport.country_code.toUpperCase();
        const destinationCountry = country_code.toUpperCase();
        if (passportCountry === destinationCountry) {
            return {
                id: crypto.randomUUID(),
                country_code: destinationCountry,
                visa_status: 'No Visa Required (Domestic Travel)',
                visa_duration: null,
                mandatory_reg: false,
            };
        }
        try {
            const response = await axios_1.default.post('https://visa-requirement.p.rapidapi.com/v2/visa/check', {
                passport: passportCountry,
                destination: destinationCountry,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'visa-requirement.p.rapidapi.com',
                },
                timeout: 5000,
            });
            const visaData = response.data?.data;
            if (!visaData) {
                throw new Error('Invalid API response structure');
            }
            const primaryRule = visaData.visa_rules?.primary_rule || visaData.visa_requirement || {};
            const visaStatus = primaryRule.name || primaryRule.type || 'Visa Required';
            const visaDuration = primaryRule.duration || primaryRule.max_stay || null;
            const mandatoryReg = !!visaData.mandatory_registration;
            return {
                id: crypto.randomUUID(),
                country_code: destinationCountry,
                visa_status: visaStatus,
                visa_duration: visaDuration,
                mandatory_reg: mandatoryReg,
            };
        }
        catch (err) {
            console.error('Visa API Error:', err.response?.data || err.message);
            throw new common_1.HttpException('Unable to fetch visa information at this time.', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
};
exports.VisaService = VisaService;
exports.VisaService = VisaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(passport_entity_1.UserPassport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VisaService);
//# sourceMappingURL=visa.service.js.map