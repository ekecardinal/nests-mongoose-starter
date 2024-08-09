import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<Blog>,
  ) {}
  async create(createBlogDto: CreateBlogDto) {
    const blog = await this.blogModel.create(createBlogDto);
    return { message: 'Created successfully' };
  }

  async findAll() {
    const blog = await this.blogModel.find();
    return { blog };
  }

  findOne(id: string) {
    return `This action returns a #${id} blog`;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogModel.findByIdAndUpdate(id, updateBlogDto, {
      new: true,
      runValidators: true,
    });
    return { message: 'Updated successfully' };
  }

  async remove(id: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new BadRequestException('Category does not exist');
    }

    const del = await this.blogModel.findByIdAndDelete(id);
    return { message: 'Deleted successfully' };
  }
}
