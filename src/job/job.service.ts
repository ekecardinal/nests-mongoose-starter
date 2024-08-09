import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
  ) {}

  async create(createJobDto: CreateJobDto) {
    const job = await this.jobModel.create(createJobDto);
    return { message: 'Created job successfully' };
  }

  async findAll() {
    const job = await this.jobModel.find();
    return { job };
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.jobModel.findByIdAndUpdate(id, updateJobDto, {
      new: true,
      runValidators: true,
    });
    return { message: 'Updated successfully' };
  }

  async remove(id: string) {
    const blog = await this.jobModel.findById(id);
    if (!blog) {
      throw new BadRequestException('Job does not exist');
    }

    const del = await this.jobModel.findByIdAndDelete(id);
    return { message: 'Deleted successfully' };
  }
}
