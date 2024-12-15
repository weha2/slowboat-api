import { Module } from '@nestjs/common';
import { CountryCodeService } from './country-code.service';
import { CountryCodeController } from './country-code.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CountryCodeController],
  providers: [CountryCodeService],
})
export class CountryCodeModule {}
