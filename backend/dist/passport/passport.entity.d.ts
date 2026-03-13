import { User } from '../users/user.entity';
export declare class UserPassport {
    id: string;
    country_code: string;
    expiry_date: Date;
    user: User;
    created_at: Date;
    updated_at: Date;
}
