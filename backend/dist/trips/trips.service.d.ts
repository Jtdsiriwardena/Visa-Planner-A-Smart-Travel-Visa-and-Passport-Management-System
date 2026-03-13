import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { TripDestination } from './trip-destination.entity';
import { UserPassport } from '../passport/passport.entity';
export declare class TripsService {
    private readonly tripRepo;
    private readonly destRepo;
    private readonly passportRepo;
    constructor(tripRepo: Repository<Trip>, destRepo: Repository<TripDestination>, passportRepo: Repository<UserPassport>);
    createTrip(userId: string, data: {
        name: string;
        start_date: string;
        end_date: string;
    }): Promise<Trip>;
    addDestination(tripId: string, passportId: string, country_code: string): Promise<TripDestination>;
    deleteDestination(tripId: string, destId: string): Promise<TripDestination>;
    deleteTrip(userId: string, tripId: string): Promise<Trip>;
    private addDestinationWithPassport;
    getTrips(userId: string): Promise<Trip[]>;
    getTripById(tripId: string, userId: string): Promise<Trip>;
    findOneWithDestinations(id: string): Promise<Trip>;
    private mapVisaCategory;
}
