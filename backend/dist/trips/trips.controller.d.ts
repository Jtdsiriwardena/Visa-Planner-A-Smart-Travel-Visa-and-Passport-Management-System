import { TripsService } from './trips.service';
import type { Response } from 'express';
export declare class TripsController {
    private readonly tripsService;
    constructor(tripsService: TripsService);
    createTrip(req: any, body: {
        name: string;
        start_date: string;
        end_date: string;
    }): Promise<import("./trip.entity").Trip>;
    addDestination(tripId: string, body: {
        passport_id: string;
        country_code: string;
    }): Promise<import("./trip-destination.entity").TripDestination>;
    getTrips(req: any): Promise<import("./trip.entity").Trip[]>;
    deleteDestination(tripId: string, destId: string): Promise<import("./trip-destination.entity").TripDestination>;
    deleteTrip(req: any, tripId: string): Promise<import("./trip.entity").Trip>;
    exportTrip(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
