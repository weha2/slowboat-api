import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductDto } from './dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<ProductDto[]> {
    return this.prismaService.product.findMany();
  }

  async findOne(id: number): Promise<ProductDto> {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Not found product.`);
    }

    return product;
  }
}
