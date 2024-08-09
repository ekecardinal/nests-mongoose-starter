import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './schemas/user.schema';
import { ResetPassword } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    const userExist = await this.userModel.findOne({
      email: email!,
    });
    if (userExist) {
      throw new BadRequestException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      ...createAuthDto,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user.id });
    return {
      token,
      user: {
        email: user.email,
        name: user.name,
        id: user.id,
      },
      message: 'Registered Successfully',
    };
  }

  // Login
  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; user: object; message: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({
      email: email,
    });
    console.log('user', user);
    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    if (user.disabled) {
      throw new UnauthorizedException('User disabled contact admin');
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = this.jwtService.sign({ id: user.id });

    return {
      token,
      user: {
        email: user.email,
        name: user.name,
        id: user.id,
      },
      message: 'Login Successfully',
    };
  }

  async findAll() {
    return await this.userModel.find();
  }

  // Update Staff
  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return await this.userModel.findByIdAndUpdate({
      id: id,
      data: updateAuthDto,
    });
  }

  //Reset Password
  async resetPassword(id: string, updateAuthDto: ResetPassword) {
    const password = updateAuthDto.password;
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userModel.findByIdAndUpdate({
      id: id,
      password: hashedPassword,
    });
  }

  //Delete User
  async remove(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    await this.userModel.findByIdAndDelete(id);
    return { message: 'User deleted successfully' };
  }
}
