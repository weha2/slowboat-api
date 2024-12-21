import { ApiProperty } from '@nestjs/swagger';

export class Charge {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paid: boolean;

  @ApiProperty()
  transaction: string;

  @ApiProperty()
  created_at: string;
}
