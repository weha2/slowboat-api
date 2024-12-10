import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dtos/order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly bookingService: OrderService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find order' })
  @ApiResponse({ status: HttpStatus.OK, type: OrderDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrderDto> {
    return this.bookingService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() body: OrderDto): Promise<OrderDto> {
    return this.bookingService.create(body);
  }
}
