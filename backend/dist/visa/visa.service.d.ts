import { Repository } from 'typeorm';
import { UserPassport } from '../passport/passport.entity';
export interface VisaCheckDto {
    passport_id: string;
    country_code: string;
}
export interface VisaResult {
    id: string;
    country_code: string;
    visa_status: string;
    visa_duration: string | null;
    mandatory_reg: boolean;
}
export declare class VisaService {
    private readonly passportRepo;
    constructor(passportRepo: Repository<UserPassport>);
    checkVisa(userId: string, dto: VisaCheckDto): Promise<VisaResult>;
}
