import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @ApiProperty({ type: String, description: 'First Name' })
  @IsOptional()
  readonly firstName: string;

  @ApiProperty({ type: String, description: 'Last Name' })
  @IsOptional()
  readonly lastName: string;

  @ApiProperty({ type: String, description: 'Phone No' })
  @IsOptional()
  readonly phone: string;

  @ApiProperty({
    type: String,
    description: 'How you heard about us',
    required: false,
  })
  @IsOptional()
  readonly about: string;

  @ApiProperty({
    type: String,
    description: 'What is your occupation',
    required: false,
  })
  @IsOptional()
  readonly occupation: string;

  @ApiProperty({
    type: String,
    description: 'Who is your next of kin',
    required: false,
  })
  @IsOptional()
  readonly nextOfKin: string;

  @ApiProperty({
    type: String,
    description: 'What is your next of kin phone',
    required: false,
  })
  @IsOptional()
  readonly nextOfKinPhone: string;

  @ApiProperty({ type: String, description: 'Email' })
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsOptional()
  @MinLength(8)
  readonly password: string;

  @IsOptional()
  readonly disabled: boolean;
}
