import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenderDto } from './dtos/gender.dto';

@Injectable()
export class GenderService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<GenderDto[]> {
    return this.prismaService.gender.findMany();
  }
}
