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
import { Model, Types } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './schemas/user.schema';
import { Otp } from './schemas/otp.schema';
import { OtpMessage } from './mail/otp';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { transporter } from '../mail-transporter/transporter';
import { Query } from 'express-serve-static-core';

interface OtpType {
  firstName: string;
  email: string;
  id: string | Types.ObjectId;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    @InjectModel(Otp.name)
    private otpModel: Model<Otp>,
  ) {}

  //Register User
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

    const otp = await this.sendOtp({
      email: user.email,
      firstName: user.firstName,
      id: user._id,
    });

    const token = this.jwtService.sign({
      id: user.id,
    });
    return {
      token,
      user: {
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        id: user._id,
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
    const token = this.jwtService.sign({ id: user._id });

    return {
      token,
      user: {
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        id: user._id,
      },
      message: 'Login Successfully',
    };
  }

  async findAll(query: Query): Promise<{ students: User[]; count: number }> {
    const limit = Number(query.limit) || 20;
    const currentPage = Number(query.offset) || 1;
    const skip = limit * (currentPage - 1);
    const firstName = query.name
      ? {
          firstName: {
            $regex: query.firstName,
            $options: 'i',
          },
        }
      : {};
    const email = query.email
      ? {
          email: {
            $regex: query.email,
            $options: 'i',
          },
        }
      : {};
    const students = await this.userModel
      .find({ ...firstName, ...email })
      .skip(skip)
      .limit(limit);

    const count = await this.userModel.countDocuments({
      ...firstName,
      ...email,
    });
    return { students, count };
  }

  // Update User
  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return await this.userModel.findByIdAndUpdate(id, { updateAuthDto });
  }

  //Reset Password
  async resetPassword(updateAuthDto: LoginDto) {
    const password = updateAuthDto.password;
    const user = await this.userModel.findOne({ email: updateAuthDto.email });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userModel.findByIdAndUpdate(user._id, {
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

  // Email OTP
  async emailOtp(emailDto: ResetPasswordDto) {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    const user = await this.userModel.findOne({
      email: emailDto.email,
    });
    const hashedOtp = await bcrypt.hash(otp, 10);
    const res = await this.otpModel.create({
      userId: user.id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await transporter.sendMail(OtpMessage({ ...user, otp }));
    return { message: 'OTP sent to email', user };
  }

  //send OTP
  async sendOtp(contact: OtpType) {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    const hashedOtp = await bcrypt.hash(otp, 10);
    const res = await this.otpModel.create({
      userId: contact.id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await transporter.sendMail(OtpMessage({ ...contact, otp }));
    return res;
  }

  // Resend OTP
  async resendOtp(contact: ResendOtpDto) {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    if (!contact.id) {
      throw new BadRequestException('Invalid User');
    }
    const user = await this.userModel.findById(contact.id);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const del = await this.otpModel.deleteMany({ userId: contact.id });
    const hashedOtp = await bcrypt.hash(otp, 10);
    const res = await this.otpModel.create({
      userId: contact.id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await transporter.sendMail(
      OtpMessage({ firstName: user.firstName, email: user.email, otp }),
    );
    return { message: 'OTP sent successfully' };
  }

  // Verify OTP
  async verifyOtp(contact: VerifyOtpDto) {
    const user = await this.userModel.findById(contact.id);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const otp = await this.otpModel.findOne({ userId: contact.id });
    if (!otp) {
      throw new UnauthorizedException('OTP does not exist');
    }
    if (otp.expiresAt < Date.now()) {
      throw new UnauthorizedException('OTP expired');
    }
    const valid = await bcrypt.compare(contact.otp, otp.otp);
    if (!valid) {
      throw new UnauthorizedException('Invalid OTP');
    }
    const del = await this.otpModel.deleteOne({ userId: contact.id });

    const res = await this.userModel.findByIdAndUpdate(
      contact.id,
      {
        verified: true,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return { message: 'OTP verified successfully', user: res };
  }
}
