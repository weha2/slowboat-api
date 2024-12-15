import { CountryCode } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CountryCodeDto implements CountryCode {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dialCode: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
