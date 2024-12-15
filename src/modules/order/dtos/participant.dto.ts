import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
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
  lastname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  countryCodeId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryCodeName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  dateBirth: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  genderId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  genderName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  countryNationalityId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryNationalityName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passportNumber: string;
}
