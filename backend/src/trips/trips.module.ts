import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { TripDestination } from './trip-destination.entity';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { UserPassport } from '../passport/passport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripDestination, UserPassport])],
  providers: [TripsService],
  controllers: [TripsController],
})
export class TripsModule {}
