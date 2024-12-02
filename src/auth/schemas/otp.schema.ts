import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: string;

  @Prop()
  otp: string;

  @Prop()
  createdAt: number;

  @Prop()
  expiresAt: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
