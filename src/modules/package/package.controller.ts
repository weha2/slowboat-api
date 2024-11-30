import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PackageService } from './package.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PackageDto } from './dtos/package.dto';

@ApiTags('Package')
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all package' })
  @ApiResponse({ status: HttpStatus.OK, type: [PackageDto] })
  async findAll(): Promise<PackageDto[]> {
    return this.packageService.findAll();
  }
}
