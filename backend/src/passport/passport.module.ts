import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportService } from './passport.service';
import { PassportController } from './passport.controller';
import { UserPassport } from './passport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPassport])],
  providers: [PassportService],
  controllers: [PassportController],
  exports: [PassportService],
})
export class PassportModule {}
