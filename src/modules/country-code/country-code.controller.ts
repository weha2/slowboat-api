import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CountryCodeService } from './country-code.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CountryCodeDto } from './dtos/country-code.dto';

@ApiTags('Country Code')
@Controller('country-codes')
export class CountryCodeController {
  constructor(private readonly countryCodeService: CountryCodeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all country codes' })
  @ApiResponse({ status: HttpStatus.OK, type: [CountryCodeDto] })
  async findAll(): Promise<CountryCodeDto[]> {
    return this.countryCodeService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload JSON file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.CREATED, type: [CountryCodeDto] })
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
  ): Promise<CountryCodeDto[]> {
    try {
      const body = JSON.parse(file.buffer.toString());
      return await this.countryCodeService.create(body);
    } catch (error) {
      throw error;
    }
  }
}
