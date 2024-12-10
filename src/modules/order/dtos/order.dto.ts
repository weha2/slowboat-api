import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContactDto } from './contact.dto';
import { ParticipantDto } from './participant.dto';
import { PaymentStatus } from '@prisma/client';

export class OrderDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  orderId?: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  additionalRequest?: string;

  @ApiProperty({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  statusMessage?: string;

  @ApiProperty({ type: Date })
  completedAt?: Date;

  @ApiProperty({ type: ContactDto })
  @Type(() => ContactDto)
  contact: ContactDto;

  @ApiProperty({ type: [ParticipantDto] })
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];
}
