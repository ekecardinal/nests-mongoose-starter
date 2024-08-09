import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Blog {
  @Prop()
  title: String;

  @Prop()
  description: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
