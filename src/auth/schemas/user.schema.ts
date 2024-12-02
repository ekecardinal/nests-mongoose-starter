import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  about: string;

  @Prop()
  occupation: string;

  @Prop()
  nextOfKin: string;

  @Prop()
  nextOfKinPhone: string;

  @Prop({ unique: [true, 'User already exists'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  disabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
