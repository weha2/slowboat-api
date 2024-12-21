import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateChargeDto } from './dtos/create-charge.dto';
import { Charge } from './dtos/charge.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('charge')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, type: Charge })
  async createCharge(@Body() body: CreateChargeDto): Promise<Charge> {
    return this.paymentService.createCharge(body);
  }

  @Get('charge/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: Charge })
  async getCharge(@Param('id') id: string): Promise<Charge> {
    return this.paymentService.retrieveCharge(id);
  }
}
