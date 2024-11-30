import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDto } from './dtos/booking.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find booking' })
  @ApiResponse({ status: HttpStatus.OK, type: BookingDto })
  async findOne(@Param('id') id: number): Promise<BookingDto> {
    return this.bookingService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create booking' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() body: BookingDto): Promise<BookingDto> {
    return this.bookingService.create(body);
  }
}
