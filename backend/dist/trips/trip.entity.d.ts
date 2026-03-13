import { User } from '../users/user.entity';
import { TripDestination } from './trip-destination.entity';
export declare class Trip {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    user: User;
    destinations: TripDestination[];
    created_at: Date;
    updated_at: Date;
}
