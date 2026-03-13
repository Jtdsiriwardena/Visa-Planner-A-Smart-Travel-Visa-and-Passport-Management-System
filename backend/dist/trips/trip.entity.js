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
exports.Trip = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const trip_destination_entity_1 = require("./trip-destination.entity");
let Trip = class Trip {
    id;
    name;
    start_date;
    end_date;
    user;
    destinations;
    created_at;
    updated_at;
};
exports.Trip = Trip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Trip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Trip.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Trip.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.trips),
    __metadata("design:type", user_entity_1.User)
], Trip.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => trip_destination_entity_1.TripDestination, (destination) => destination.trip),
    __metadata("design:type", Array)
], Trip.prototype, "destinations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "updated_at", void 0);
exports.Trip = Trip = __decorate([
    (0, typeorm_1.Entity)()
], Trip);
//# sourceMappingURL=trip.entity.js.map