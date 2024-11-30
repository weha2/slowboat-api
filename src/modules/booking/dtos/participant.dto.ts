import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ParticipantDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numberPhone: string;

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  dateBirth: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passportNumber: string;
}
