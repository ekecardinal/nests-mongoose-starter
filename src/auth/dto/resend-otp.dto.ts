import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    type: String,
    description: 'User Id',
    example: '66f3debfe45172a86769572e',
  })
  @IsNotEmpty()
  readonly id: string;
}
