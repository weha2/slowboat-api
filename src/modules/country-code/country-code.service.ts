import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CountryCodeDto } from './dtos/country-code.dto';

@Injectable()
export class CountryCodeService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<CountryCodeDto[]> {
    return this.prismaService.countryCode.findMany();
  }

  async create(body: any): Promise<CountryCodeDto[]> {
    await this.prismaService.$transaction(async (tx) => {
      await tx.countryCode.createMany({
        data: body.flatMap((country: any) => ({
          name: country.name,
          dialCode: country.dial_code,
          code: country.code,
        })),
        skipDuplicates: true,
      });
    });
    return this.findAll();
  }
}
