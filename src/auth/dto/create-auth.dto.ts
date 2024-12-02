import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ type: String, description: 'First Name', example: 'John' })
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ type: String, description: 'Last Name', example: 'Doe' })
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    type: String,
    description: 'Phone No',
    example: '08065568671',
  })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    type: String,
    description: 'How you heard about us',
    required: false,
    example: 'Twitter',
  })
  @IsOptional()
  readonly about: string;

  @ApiProperty({
    type: String,
    description: 'What is your occupation',
    required: false,
    example: 'Software Engineer',
  })
  @IsOptional()
  readonly occupation: string;

  @ApiProperty({
    type: String,
    description: 'Who is your next of kin',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  readonly nextOfKin: string;

  @ApiProperty({
    type: String,
    description: 'What is your next of kin phone',
    required: false,
    example: '08065568671',
  })
  @IsOptional()
  readonly nextOfKinPhone: string;

  @ApiProperty({
    type: String,
    description: 'Email',
    example: 'ekecardinal@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, description: 'Password', example: '12345678' })
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsOptional()
  readonly disabled: boolean;
}
