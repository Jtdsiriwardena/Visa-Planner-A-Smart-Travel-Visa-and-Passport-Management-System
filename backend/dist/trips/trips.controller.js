"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsController = void 0;
const common_1 = require("@nestjs/common");
const trips_service_1 = require("./trips.service");
const passport_1 = require("@nestjs/passport");
const puppeteer = __importStar(require("puppeteer"));
const trip_pdf_template_1 = require("./utils/trip-pdf.template");
let TripsController = class TripsController {
    tripsService;
    constructor(tripsService) {
        this.tripsService = tripsService;
    }
    createTrip(req, body) {
        return this.tripsService.createTrip(req.user.userId, body);
    }
    addDestination(tripId, body) {
        return this.tripsService.addDestination(tripId, body.passport_id, body.country_code);
    }
    getTrips(req) {
        return this.tripsService.getTrips(req.user.userId);
    }
    deleteDestination(tripId, destId) {
        return this.tripsService.deleteDestination(tripId, destId);
    }
    deleteTrip(req, tripId) {
        return this.tripsService.deleteTrip(req.user.userId, tripId);
    }
    async exportTrip(id, res) {
        const trip = await this.tripsService.findOneWithDestinations(id);
        if (!trip) {
            return res.status(404).send('Trip not found');
        }
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        const html = (0, trip_pdf_template_1.generateTripHTML)(trip);
        await page.setContent(html, {
            waitUntil: 'networkidle0',
        });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
        });
        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${trip.name}.pdf"`);
        return res.send(pdf);
    }
};
exports.TripsController = TripsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "createTrip", null);
__decorate([
    (0, common_1.Post)(':tripId/destination'),
    __param(0, (0, common_1.Param)('tripId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "addDestination", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "getTrips", null);
__decorate([
    (0, common_1.Delete)(':tripId/destination/:destId'),
    __param(0, (0, common_1.Param)('tripId')),
    __param(1, (0, common_1.Param)('destId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "deleteDestination", null);
__decorate([
    (0, common_1.Delete)(':tripId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('tripId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "deleteTrip", null);
__decorate([
    (0, common_1.Get)(':id/export'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TripsController.prototype, "exportTrip", null);
exports.TripsController = TripsController = __decorate([
    (0, common_1.Controller)('trips'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [trips_service_1.TripsService])
], TripsController);
//# sourceMappingURL=trips.controller.js.map