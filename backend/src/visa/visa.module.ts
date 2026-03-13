import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisaService } from './visa.service';
import { VisaController } from './visa.controller';
import { UserPassport } from '../passport/passport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPassport])],
  providers: [VisaService],
  controllers: [VisaController],
})
export class VisaModule {}
