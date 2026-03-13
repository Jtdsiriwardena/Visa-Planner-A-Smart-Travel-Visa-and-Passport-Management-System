import { PassportService } from './passport.service';
export declare class PassportController {
    private readonly passportService;
    constructor(passportService: PassportService);
    getAll(req: any): Promise<import("./passport.entity").UserPassport[]>;
    create(req: any, body: {
        country_code: string;
        expiry_date: string;
    }): Promise<import("./passport.entity").UserPassport>;
    update(req: any, id: string, body: {
        country_code?: string;
        expiry_date?: string;
    }): Promise<import("./passport.entity").UserPassport>;
    delete(req: any, id: string): Promise<import("./passport.entity").UserPassport>;
}
