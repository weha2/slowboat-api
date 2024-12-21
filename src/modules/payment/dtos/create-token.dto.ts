import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateTokenDto {
  @ApiProperty({
    example: 'Test Name',
    description: 'Name on card',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '4242424242424242',
    description: 'Card number',
  })
  @IsNotEmpty()
  @IsString()
  @Length(16, 16)
  number: string;

  @ApiProperty({
    example: 12,
    description: 'Expiration month (1-12)',
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  expiration_month: number;

  @ApiProperty({
    example: 2024,
    description: 'Expiration year',
  })
  @IsNumber()
  @Min(2024)
  expiration_year: number;

  @ApiProperty({
    example: 123,
    description: 'Security code (CVV/CVC)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 4)
  security_code: string;
}
