import { UserPassport } from '../passport/passport.entity';
import { Trip } from '../trips/trip.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
    passports: UserPassport[];
    trips: Trip[];
}
