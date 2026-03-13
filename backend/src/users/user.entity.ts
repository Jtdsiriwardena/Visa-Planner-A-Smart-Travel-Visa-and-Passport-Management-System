import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserPassport } from '../passport/passport.entity';
import { Trip } from '../trips/trip.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, default: 'Unknown' })
  name: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserPassport, (passport) => passport.user)
  passports: UserPassport[];

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];
}
