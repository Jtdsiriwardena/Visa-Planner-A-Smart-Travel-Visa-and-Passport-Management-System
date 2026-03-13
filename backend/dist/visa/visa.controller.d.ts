import { UserPassport } from '../passport/passport.entity';
import { Repository } from 'typeorm';
interface VisaCheckDto {
    passport_id: string;
    country_code: string;
}
interface VisaResult {
    id: string;
    country_code: string;
    visa_status: string;
    visa_duration: string | null;
    mandatory_reg: boolean;
}
export declare class VisaController {
    private readonly passportRepo;
    constructor(passportRepo: Repository<UserPassport>);
    checkVisa(req: any, body: VisaCheckDto): Promise<VisaResult>;
}
export {};
