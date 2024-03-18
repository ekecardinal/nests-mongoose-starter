import { IsNotEmpty } from 'class-validator';

export class ResetPassword {
  @IsNotEmpty()
  readonly password: string;
}
