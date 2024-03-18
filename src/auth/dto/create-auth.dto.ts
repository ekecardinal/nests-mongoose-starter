import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  readonly role: string;

  @IsOptional()
  readonly disabled: boolean;
}
