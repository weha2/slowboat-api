import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PackageDto } from './dtos/package.dto';

@Injectable()
export class PackageService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<PackageDto[]> {
    return this.prismaService.package.findMany();
  }
}
