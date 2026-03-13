import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Trip } from './trip.entity';
import { UserPassport } from '../passport/passport.entity';

export enum VisaCategory {
  VISA_FREE = 'visa_free',
  VISA_ON_ARRIVAL = 'visa_on_arrival',
  E_VISA = 'e_visa',
  VISA_REQUIRED = 'visa_required',
  DOMESTIC = 'domestic',
}

@Unique(['trip', 'country_code'])
@Entity('trip_destinations')
export class TripDestination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 2 })
  country_code: string;

  @Column({
    type: 'enum',
    enum: VisaCategory,
  })
  visa_category: VisaCategory;

  @Column({ type: 'varchar', nullable: true })
  visa_status: string | null;

  @Column({ type: 'varchar', nullable: true })
  visa_duration: string | null;

  @Column({ default: false })
  mandatory_reg: boolean;

  @ManyToOne(() => Trip, (trip) => trip.destinations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  trip: Trip;

  @ManyToOne(() => UserPassport, { nullable: true })
  passport: UserPassport;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
