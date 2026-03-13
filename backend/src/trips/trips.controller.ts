import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { AuthGuard } from '@nestjs/passport';
import * as puppeteer from 'puppeteer';
import { generateTripHTML } from './utils/trip-pdf.template';

// ✅ IMPORTANT: type-only import fixes TS1272
import type { Response } from 'express';

@Controller('trips')
@UseGuards(AuthGuard('jwt'))
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  createTrip(
    @Req() req: any,
    @Body() body: { name: string; start_date: string; end_date: string },
  ) {
    return this.tripsService.createTrip(req.user.userId, body);
  }

  @Post(':tripId/destination')
  addDestination(
    @Param('tripId') tripId: string,
    @Body() body: { passport_id: string; country_code: string },
  ) {
    return this.tripsService.addDestination(
      tripId,
      body.passport_id,
      body.country_code,
    );
  }

  @Get()
  getTrips(@Req() req: any) {
    return this.tripsService.getTrips(req.user.userId);
  }

  @Delete(':tripId/destination/:destId')
  deleteDestination(
    @Param('tripId') tripId: string,
    @Param('destId') destId: string,
  ) {
    return this.tripsService.deleteDestination(tripId, destId);
  }

  @Delete(':tripId')
  deleteTrip(@Req() req: any, @Param('tripId') tripId: string) {
    return this.tripsService.deleteTrip(req.user.userId, tripId);
  }

  @Get(':id/export')
  async exportTrip(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const trip = await this.tripsService.findOneWithDestinations(id);

    if (!trip) {
      return res.status(404).send('Trip not found');
    }

    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const html = generateTripHTML(trip);

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${trip.name}.pdf"`,
    );

    return res.send(pdf);
  }
}
