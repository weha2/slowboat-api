import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CountryNationalityService } from './country-nationality.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CountryNationalityDto } from './dtos/country-nationality.dto';

@ApiTags('Country Nationality')
@Controller('country-nationalities')
export class CountryNationalityController {
  constructor(
    private readonly countryNationalityService: CountryNationalityService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all country codes' })
  @ApiResponse({ status: HttpStatus.OK, type: [CountryNationalityDto] })
  async findAll(): Promise<CountryNationalityDto[]> {
    return this.countryNationalityService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload JSON file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED, type: [CountryNationalityDto] })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JSON file to upload',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CountryNationalityDto[]> {
    try {
      const body = JSON.parse(file.buffer.toString());
      return this.countryNationalityService.create(body);
    } catch (error) {
      throw error;
    }
  }
}
