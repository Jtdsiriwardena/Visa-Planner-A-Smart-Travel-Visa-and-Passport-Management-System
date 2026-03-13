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
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trip_entity_1 = require("./trip.entity");
const trip_destination_entity_1 = require("./trip-destination.entity");
const passport_entity_1 = require("../passport/passport.entity");
const axios_1 = __importDefault(require("axios"));
let TripsService = class TripsService {
    tripRepo;
    destRepo;
    passportRepo;
    constructor(tripRepo, destRepo, passportRepo) {
        this.tripRepo = tripRepo;
        this.destRepo = destRepo;
        this.passportRepo = passportRepo;
    }
    async createTrip(userId, data) {
        const trip = this.tripRepo.create({
            ...data,
            user: { id: userId },
        });
        return this.tripRepo.save(trip);
    }
    async addDestination(tripId, passportId, country_code) {
        const passport = await this.passportRepo.findOne({
            where: { id: passportId },
        });
        if (!passport) {
            throw new common_1.NotFoundException('User passport not found');
        }
        return this.addDestinationWithPassport(tripId, passport, country_code);
    }
    async deleteDestination(tripId, destId) {
        const dest = await this.destRepo.findOne({
            where: { id: destId, trip: { id: tripId } },
        });
        if (!dest) {
            throw new common_1.NotFoundException('Destination not found');
        }
        return this.destRepo.remove(dest);
    }
    async deleteTrip(userId, tripId) {
        const trip = await this.tripRepo.findOne({
            where: { id: tripId, user: { id: userId } },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return this.tripRepo.remove(trip);
    }
    async addDestinationWithPassport(tripId, passport, country_code) {
        if (!country_code) {
            throw new common_1.BadRequestException('Destination country code is missing');
        }
        const passportCountry = passport.country_code.toUpperCase();
        const destinationCountry = country_code.toUpperCase();
        const existing = await this.destRepo.findOne({
            where: {
                trip: { id: tripId },
                country_code: destinationCountry,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Destination already added to this trip');
        }
        if (passportCountry === destinationCountry) {
            const dest = this.destRepo.create({
                country_code: destinationCountry,
                visa_status: 'No Visa Required (Domestic Travel)',
                visa_duration: null,
                mandatory_reg: false,
                visa_category: trip_destination_entity_1.VisaCategory.DOMESTIC,
                trip: { id: tripId },
                passport: passport,
            });
            return this.destRepo.save(dest);
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
            const primaryRule = visaData.visa_rules?.primary_rule ||
                visaData.visa_requirement ||
                {};
            const visaStatus = primaryRule.name ||
                primaryRule.type ||
                'Visa Required';
            const visaDuration = primaryRule.duration ||
                primaryRule.max_stay ||
                null;
            const dest = this.destRepo.create({
                country_code: visaData.destination?.code || destinationCountry,
                visa_status: visaStatus,
                visa_duration: visaDuration,
                mandatory_reg: !!visaData.mandatory_registration,
                visa_category: this.mapVisaCategory(visaStatus),
                trip: { id: tripId },
                passport: passport,
            });
            return this.destRepo.save(dest);
        }
        catch (error) {
            console.error('Visa API Error:', error.response?.data || error.message);
            throw new common_1.HttpException('Unable to fetch visa information at this time.', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async getTrips(userId) {
        return this.tripRepo.find({
            where: { user: { id: userId } },
            relations: ['destinations', 'destinations.passport'],
            order: { start_date: 'ASC' },
        });
    }
    async getTripById(tripId, userId) {
        const trip = await this.tripRepo.findOne({
            where: { id: tripId, user: { id: userId } },
            relations: ['destinations'],
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return trip;
    }
    async findOneWithDestinations(id) {
        const trip = await this.tripRepo.findOne({
            where: { id },
            relations: ['destinations', 'destinations.passport'],
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return trip;
    }
    mapVisaCategory(status) {
        const s = status.toLowerCase();
        if (s.includes('domestic'))
            return trip_destination_entity_1.VisaCategory.DOMESTIC;
        if (s.includes('no visa'))
            return trip_destination_entity_1.VisaCategory.VISA_FREE;
        if (s.includes('visa on arrival'))
            return trip_destination_entity_1.VisaCategory.VISA_ON_ARRIVAL;
        if (s.includes('e-visa'))
            return trip_destination_entity_1.VisaCategory.E_VISA;
        return trip_destination_entity_1.VisaCategory.VISA_REQUIRED;
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(1, (0, typeorm_1.InjectRepository)(trip_destination_entity_1.TripDestination)),
    __param(2, (0, typeorm_1.InjectRepository)(passport_entity_1.UserPassport)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TripsService);
//# sourceMappingURL=trips.service.js.map