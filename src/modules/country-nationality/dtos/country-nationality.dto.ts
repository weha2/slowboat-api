import { ApiProperty } from '@nestjs/swagger';
import { CountryNationality } from '@prisma/client';

export class CountryNationalityDto implements CountryNationality {
  @ApiProperty()
  id: number;

  @ApiProperty()
  numCode: string;

  @ApiProperty()
  alpha2Code: string;

  @ApiProperty()
  alpha3Code: string;

  @ApiProperty()
  enShortName: string;

  @ApiProperty()
  nationality: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
