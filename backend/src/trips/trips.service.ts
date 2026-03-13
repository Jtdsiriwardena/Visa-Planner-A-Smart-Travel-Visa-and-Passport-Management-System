import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { TripDestination, VisaCategory } from './trip-destination.entity';
import { UserPassport } from '../passport/passport.entity';
import axios from 'axios';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,

    @InjectRepository(TripDestination)
    private readonly destRepo: Repository<TripDestination>,

    @InjectRepository(UserPassport)
    private readonly passportRepo: Repository<UserPassport>,
  ) {}

  // -------------------------
  // Create Trip
  // -------------------------
  async createTrip(
    userId: string,
    data: { name: string; start_date: string; end_date: string },
  ) {
    const trip = this.tripRepo.create({
      ...data,
      user: { id: userId },
    });

    return this.tripRepo.save(trip);
  }

  // -------------------------
  // Add Destination
  // -------------------------
  async addDestination(
    tripId: string,
    passportId: string,
    country_code: string,
  ) {
    const passport = await this.passportRepo.findOne({
      where: { id: passportId },
    });

    if (!passport) {
      throw new NotFoundException('User passport not found');
    }

    return this.addDestinationWithPassport(tripId, passport, country_code);
  }

  // -------------------------
  // Delete Destination
  // -------------------------
  async deleteDestination(tripId: string, destId: string) {
    const dest = await this.destRepo.findOne({
      where: { id: destId, trip: { id: tripId } },
    });

    if (!dest) {
      throw new NotFoundException('Destination not found');
    }

    return this.destRepo.remove(dest);
  }

  // -------------------------
  // Delete Trip
  // -------------------------
  async deleteTrip(userId: string, tripId: string) {
    const trip = await this.tripRepo.findOne({
      where: { id: tripId, user: { id: userId } },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return this.tripRepo.remove(trip);
  }

  // -------------------------
  // Internal Destination Logic
  // -------------------------
  private async addDestinationWithPassport(
    tripId: string,
    passport: UserPassport,
    country_code: string,
  ) {
    if (!country_code) {
      throw new BadRequestException('Destination country code is missing');
    }

    const passportCountry = passport.country_code.toUpperCase();
    const destinationCountry = country_code.toUpperCase();

    // Prevent duplicate destination
    const existing = await this.destRepo.findOne({
      where: {
        trip: { id: tripId },
        country_code: destinationCountry,
      },
    });

    if (existing) {
      throw new BadRequestException('Destination already added to this trip');
    }

    // -------------------
    // Domestic Travel
    // -------------------
    if (passportCountry === destinationCountry) {
      const dest = this.destRepo.create({
        country_code: destinationCountry,
        visa_status: 'No Visa Required (Domestic Travel)',
        visa_duration: null,
        mandatory_reg: false,
        visa_category: VisaCategory.DOMESTIC,
        trip: { id: tripId },
        passport: passport,
      });

      return this.destRepo.save(dest);
    }

    // -------------------
    // External API Call
    // -------------------
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
        visaData.visa_rules?.primary_rule ||
        visaData.visa_requirement ||
        {};

      const visaStatus =
        primaryRule.name ||
        primaryRule.type ||
        'Visa Required';

      const visaDuration =
        primaryRule.duration ||
        primaryRule.max_stay ||
        null;

      const dest = this.destRepo.create({
        country_code:
          visaData.destination?.code || destinationCountry,
        visa_status: visaStatus,
        visa_duration: visaDuration,
        mandatory_reg: !!visaData.mandatory_registration,
        visa_category: this.mapVisaCategory(visaStatus),
        trip: { id: tripId },
        passport: passport,
      });

      return this.destRepo.save(dest);
    } catch (error: any) {
      console.error(
        'Visa API Error:',
        error.response?.data || error.message,
      );

      throw new HttpException(
        'Unable to fetch visa information at this time.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // -------------------------
  // Get All Trips
  // -------------------------
  async getTrips(userId: string) {
    return this.tripRepo.find({
      where: { user: { id: userId } },
      relations: ['destinations', 'destinations.passport'],
      order: { start_date: 'ASC' },
    });
  }

  // -------------------------
  // Get Single Trip
  // -------------------------
  async getTripById(tripId: string, userId: string) {
    const trip = await this.tripRepo.findOne({
      where: { id: tripId, user: { id: userId } },
      relations: ['destinations'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  // -------------------------
  // PDF Support
  // -------------------------
  async findOneWithDestinations(id: string) {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: ['destinations', 'destinations.passport'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  // -------------------------
  // Visa Category Mapper
  // -------------------------
  private mapVisaCategory(status: string): VisaCategory {
    const s = status.toLowerCase();

    if (s.includes('domestic')) return VisaCategory.DOMESTIC;
    if (s.includes('no visa')) return VisaCategory.VISA_FREE;
    if (s.includes('visa on arrival')) return VisaCategory.VISA_ON_ARRIVAL;
    if (s.includes('e-visa')) return VisaCategory.E_VISA;

    return VisaCategory.VISA_REQUIRED;
  }
}
