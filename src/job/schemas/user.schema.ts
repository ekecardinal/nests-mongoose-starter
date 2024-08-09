import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Job {
  @Prop()
  title: string;

  @Prop()
  subTitle: string;

  @Prop()
  description: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
