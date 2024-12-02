import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'ekecardinal@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @ApiProperty({ type: String, description: 'Password', example: '12345678' })
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
