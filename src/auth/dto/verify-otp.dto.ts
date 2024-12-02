import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    type: String,
    description: 'User Id',
    example: '66f3debfe45172a86769572e',
  })
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({ type: String, description: 'OTP', example: '992029' })
  @IsNotEmpty()
  readonly otp: string;
}
