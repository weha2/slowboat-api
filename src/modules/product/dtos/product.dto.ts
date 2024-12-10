import { Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto implements Product {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
