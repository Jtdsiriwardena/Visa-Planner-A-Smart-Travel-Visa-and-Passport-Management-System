import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserPassport } from '../passport/passport.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';

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

@UseGuards(AuthGuard('jwt'))
@Controller('visa')
export class VisaController {
  constructor(
    @InjectRepository(UserPassport)
    private readonly passportRepo: Repository<UserPassport>,
  ) {}

  @Post('check')
  async checkVisa(@Req() req, @Body() body: VisaCheckDto): Promise<VisaResult> {
    const { passport_id, country_code } = body;

    // Find user's passport
    const passport = await this.passportRepo.findOne({
      where: { id: passport_id, user: { id: req.user.userId } },
    });

    if (!passport) {
      throw new NotFoundException('Passport not found');
    }

    const passportCountry = passport.country_code.toUpperCase();
    const destinationCountry = country_code.toUpperCase();

    // Handle domestic travel case
    if (passportCountry === destinationCountry) {
      return {
        id: crypto.randomUUID(), // just a temp ID for frontend
        country_code: destinationCountry,
        visa_status: 'No Visa Required (Domestic Travel)',
        visa_duration: null,
        mandatory_reg: false,
      };
    }

    // Call RapidAPI to get visa info
    try {
      const response = await axios.post(
        'https://visa-requirement.p.rapidapi.com/v2/visa/check',
        {
          passport: passportCountry,
          destination: destinationCountry,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'visa-requirement.p.rapidapi.com',
          },
          timeout: 5000,
        },
      );

      const visaData = response.data?.data;
      if (!visaData) {
        throw new Error('Invalid API response structure');
      }

      const primaryRule =
        visaData.visa_rules?.primary_rule || visaData.visa_requirement || {};

      const visaStatus = primaryRule.name || primaryRule.type || 'Visa Required';
      const visaDuration = primaryRule.duration || primaryRule.max_stay || null;
      const mandatoryReg = !!visaData.mandatory_registration;

      return {
        id: crypto.randomUUID(), // temporary unique ID for frontend
        country_code: destinationCountry,
        visa_status: visaStatus,
        visa_duration: visaDuration,
        mandatory_reg: mandatoryReg,
      };
    } catch (err: any) {
      console.error('Visa API Error:', err.response?.data || err.message);
      throw new HttpException(
        'Unable to fetch visa information at this time.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
