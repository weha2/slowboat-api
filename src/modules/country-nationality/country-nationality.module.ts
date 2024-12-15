import { Module } from '@nestjs/common';
import { CountryNationalityService } from './country-nationality.service';
import { CountryNationalityController } from './country-nationality.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CountryNationalityController],
  providers: [CountryNationalityService],
})
export class CountryNationalityModule {}
