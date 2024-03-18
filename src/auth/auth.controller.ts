import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPassword } from './dto/reset-password.dto';

@Controller('auth/user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto): Promise<{
    token: string;
    user: object;
    message: string;
  }> {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  async loing(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; user: object; message: string }> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('')
  findAll() {
    return this.authService.findAll();
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Put('reset/:id')
  resetPassword(@Param('id') id: string, @Body() updateAuthDto: ResetPassword) {
    return this.authService.resetPassword(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
