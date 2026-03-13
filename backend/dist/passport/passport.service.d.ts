import { Repository } from 'typeorm';
import { UserPassport } from './passport.entity';
export declare class PassportService {
    private passportRepo;
    constructor(passportRepo: Repository<UserPassport>);
    findByUser(userId: string): Promise<UserPassport[]>;
    create(userId: string, data: {
        country_code: string;
        expiry_date: string;
    }): Promise<UserPassport>;
    update(userId: string, id: string, data: {
        country_code?: string;
        expiry_date?: string;
    }): Promise<UserPassport>;
    delete(userId: string, id: string): Promise<UserPassport>;
}
