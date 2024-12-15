import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CountryNationalityDto } from './dtos/country-nationality.dto';

@Injectable()
export class CountryNationalityService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<CountryNationalityDto[]> {
    return this.prismaService.countryNationality.findMany();
  }

  async create(body: any): Promise<CountryNationalityDto[]> {
    await this.prismaService.$transaction(async (tx) => {
      await tx.countryNationality.createMany({
        data: body.flatMap((country: any) => ({
          numCode: country.num_code ?? '',
          alpha2Code: country.alpha_2_code ?? '',
          alpha3Code: country.alpha_3_code ?? '',
          enShortName: country.en_short_name ?? '',
          nationality: country.nationality ?? '',
        })),
        skipDuplicates: true,
      });
    });
    return this.findAll();
  }
}
