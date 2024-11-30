import { Package } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PackageDto implements Package {
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
