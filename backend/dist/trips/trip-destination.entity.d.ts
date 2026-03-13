import { Trip } from './trip.entity';
import { UserPassport } from '../passport/passport.entity';
export declare enum VisaCategory {
    VISA_FREE = "visa_free",
    VISA_ON_ARRIVAL = "visa_on_arrival",
    E_VISA = "e_visa",
    VISA_REQUIRED = "visa_required",
    DOMESTIC = "domestic"
}
export declare class TripDestination {
    id: string;
    country_code: string;
    visa_category: VisaCategory;
    visa_status: string | null;
    visa_duration: string | null;
    mandatory_reg: boolean;
    trip: Trip;
    passport: UserPassport;
    created_at: Date;
    updated_at: Date;
}
