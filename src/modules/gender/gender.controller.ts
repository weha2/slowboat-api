import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GenderService } from './gender.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenderDto } from './dtos/gender.dto';

@ApiTags('Gender')
@Controller('genders')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all gender' })
  @ApiResponse({ status: HttpStatus.OK, type: [GenderDto] })
  async findAll(): Promise<GenderDto[]> {
    return this.genderService.findAll();
  }
}
