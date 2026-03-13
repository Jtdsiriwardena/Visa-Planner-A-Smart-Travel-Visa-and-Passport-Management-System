import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPassport } from './passport.entity';

@Injectable()
export class PassportService {
  constructor(
    @InjectRepository(UserPassport)
    private passportRepo: Repository<UserPassport>,
  ) {}

  findByUser(userId: string) {
    return this.passportRepo.find({ where: { user: { id: userId } } });
  }

  async create(
    userId: string,
    data: { country_code: string; expiry_date: string },
  ) {
    const passport = this.passportRepo.create({
      country_code: data.country_code,
      expiry_date: data.expiry_date,
      user: { id: userId },
    });
    return this.passportRepo.save(passport);
  }

  async update(
    userId: string,
    id: string,
    data: { country_code?: string; expiry_date?: string },
  ) {
    const passport = await this.passportRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!passport) throw new NotFoundException('Passport not found');
    Object.assign(passport, data);
    return this.passportRepo.save(passport);
  }

  async delete(userId: string, id: string) {
    const passport = await this.passportRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!passport) throw new NotFoundException('Passport not found');
    return this.passportRepo.remove(passport);
  }
}
