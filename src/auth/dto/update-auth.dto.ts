import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly email: string;

  //   @IsOptional()
  //   @MinLength(8)
  //   readonly password: string;

  @IsOptional()
  readonly disabled: boolean;
}
