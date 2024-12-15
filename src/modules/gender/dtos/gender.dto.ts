import { Gender } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GenderDto implements Gender {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
