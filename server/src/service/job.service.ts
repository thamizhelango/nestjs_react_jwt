import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { JobDTO } from '../service/dto/job.dto';
import { JobMapper } from '../service/mapper/job.mapper';
import { JobRepository } from '../repository/job.repository';

const relationshipNames = [];
relationshipNames.push('tasks');
relationshipNames.push('employee');

@Injectable()
export class JobService {
  logger = new Logger('JobService');

  constructor(@InjectRepository(JobRepository) private jobRepository: JobRepository) {}

  async findById(id: number): Promise<JobDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.jobRepository.findOne(id, options);
    return JobMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<JobDTO>): Promise<JobDTO | undefined> {
    const result = await this.jobRepository.findOne(options);
    return JobMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<JobDTO>): Promise<[JobDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.jobRepository.findAndCount(options);
    const jobDTO: JobDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(job => jobDTO.push(JobMapper.fromEntityToDTO(job)));
      resultList[0] = jobDTO;
    }
    return resultList;
  }

  async save(jobDTO: JobDTO, creator?: string): Promise<JobDTO | undefined> {
    const entity = JobMapper.fromDTOtoEntity(jobDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.jobRepository.save(entity);
    return JobMapper.fromEntityToDTO(result);
  }

  async update(jobDTO: JobDTO, updater?: string): Promise<JobDTO | undefined> {
    const entity = JobMapper.fromDTOtoEntity(jobDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.jobRepository.save(entity);
    return JobMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.jobRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
