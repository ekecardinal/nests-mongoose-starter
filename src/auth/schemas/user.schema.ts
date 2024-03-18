import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: String;

  @Prop({ unique: [true, 'User already exists'] })
  email: String;

  @Prop()
  password: string;

  @Prop({ type: String, enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop()
  disabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
