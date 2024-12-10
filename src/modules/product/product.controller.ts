import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductDto } from './dtos/product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly packageService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all product' })
  @ApiResponse({ status: HttpStatus.OK, type: [ProductDto] })
  async findAll(): Promise<ProductDto[]> {
    return this.packageService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a product' })
  @ApiResponse({ status: HttpStatus.OK, type: [ProductDto] })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
    return this.packageService.findOne(id);
  }
}
