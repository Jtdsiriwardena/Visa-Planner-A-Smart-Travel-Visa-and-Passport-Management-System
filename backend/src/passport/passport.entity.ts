import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('passports')
export class UserPassport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country_code: string;

  @Column({ type: 'date' })
  expiry_date: Date;

  @ManyToOne(() => User, (user) => user.passports)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
