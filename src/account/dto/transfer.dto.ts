import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class transferDto {
  @ApiProperty()
  @IsString()
  toAccountId: string; //계좌번호

  @ApiProperty()
  @IsNumber()
  amount: number;
}
