import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PassportService } from './passport.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('passport')
@UseGuards(AuthGuard('jwt'))
export class PassportController {
  constructor(private readonly passportService: PassportService) {}

  @Get()
  getAll(@Req() req) {
    return this.passportService.findByUser(req.user.userId);
  }

  @Post()
  create(
    @Req() req,
    @Body() body: { country_code: string; expiry_date: string },
  ) {
    return this.passportService.create(req.user.userId, body);
  }

  @Put(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() body: { country_code?: string; expiry_date?: string },
  ) {
    return this.passportService.update(req.user.userId, id, body);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.passportService.delete(req.user.userId, id);
  }
}
