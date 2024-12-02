import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@ApiTags('Auth')
@Controller('auth/user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'Successfully created a new user' })
  create(@Body() createAuthDto: CreateAuthDto): Promise<{
    // token: string;
    // user: object;
    message: string;
  }> {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBadRequestResponse({ description: 'Invalid Credentials' })
  @ApiResponse({ status: 200, description: 'Successfully logged in a user' })
  async loing(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; user: object; message: string }> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Successfully fetched users' })
  @ApiQuery({ name: 'firstName', example: 'john', required: false })
  @ApiQuery({ name: 'limit', example: 20, required: false })
  @ApiQuery({ name: 'offset', example: 1, required: false })
  @ApiQuery({
    name: 'email',
    example: 'ekecardinal@gmail.com',
    required: false,
  })
  @Get('')
  findAll(@Query() query: ExpressQuery) {
    return this.authService.findAll(query);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Successfully updated a user' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Put('reset')
  @ApiOperation({ summary: 'Reset a user password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully reset a user password',
  })
  resetPassword(@Body() updateAuthDto: LoginDto) {
    return this.authService.resetPassword(updateAuthDto);
  }

  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'Successfully deleted a user' })
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @ApiOperation({ summary: 'Sent User OTP' })
  @ApiBadRequestResponse({ description: 'Invalid Credentials' })
  @ApiResponse({ status: 200, description: 'Successfully sent OTP' })
  @Post('email-otp')
  emailOtp(emailDto: ResetPasswordDto) {
    return this.authService.emailOtp(emailDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiResponse({
    status: 200,
    description: 'Successfully resend OTP',
  })
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({
    status: 200,
    description: 'Successfully verify OTP',
  })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }
}
