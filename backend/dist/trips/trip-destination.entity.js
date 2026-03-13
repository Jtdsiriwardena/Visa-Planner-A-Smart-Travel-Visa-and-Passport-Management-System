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
exports.TripDestination = exports.VisaCategory = void 0;
const typeorm_1 = require("typeorm");
const trip_entity_1 = require("./trip.entity");
const passport_entity_1 = require("../passport/passport.entity");
var VisaCategory;
(function (VisaCategory) {
    VisaCategory["VISA_FREE"] = "visa_free";
    VisaCategory["VISA_ON_ARRIVAL"] = "visa_on_arrival";
    VisaCategory["E_VISA"] = "e_visa";
    VisaCategory["VISA_REQUIRED"] = "visa_required";
    VisaCategory["DOMESTIC"] = "domestic";
})(VisaCategory || (exports.VisaCategory = VisaCategory = {}));
let TripDestination = class TripDestination {
    id;
    country_code;
    visa_category;
    visa_status;
    visa_duration;
    mandatory_reg;
    trip;
    passport;
    created_at;
    updated_at;
};
exports.TripDestination = TripDestination;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TripDestination.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 2 }),
    __metadata("design:type", String)
], TripDestination.prototype, "country_code", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VisaCategory,
    }),
    __metadata("design:type", String)
], TripDestination.prototype, "visa_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TripDestination.prototype, "visa_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TripDestination.prototype, "visa_duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TripDestination.prototype, "mandatory_reg", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => trip_entity_1.Trip, (trip) => trip.destinations, {
        onDelete: 'CASCADE',
        nullable: false,
    }),
    __metadata("design:type", trip_entity_1.Trip)
], TripDestination.prototype, "trip", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => passport_entity_1.UserPassport, { nullable: true }),
    __metadata("design:type", passport_entity_1.UserPassport)
], TripDestination.prototype, "passport", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TripDestination.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TripDestination.prototype, "updated_at", void 0);
exports.TripDestination = TripDestination = __decorate([
    (0, typeorm_1.Unique)(['trip', 'country_code']),
    (0, typeorm_1.Entity)('trip_destinations')
], TripDestination);
//# sourceMappingURL=trip-destination.entity.js.map