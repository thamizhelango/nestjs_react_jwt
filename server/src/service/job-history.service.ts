import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { JobHistoryDTO } from '../service/dto/job-history.dto';
import { JobHistoryMapper } from '../service/mapper/job-history.mapper';
import { JobHistoryRepository } from '../repository/job-history.repository';

const relationshipNames = [];

@Injectable()
export class JobHistoryService {
  logger = new Logger('JobHistoryService');

  constructor(@InjectRepository(JobHistoryRepository) private jobHistoryRepository: JobHistoryRepository) {}

  async findById(id: number): Promise<JobHistoryDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.jobHistoryRepository.findOne(id, options);
    return JobHistoryMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<JobHistoryDTO>): Promise<JobHistoryDTO | undefined> {
    const result = await this.jobHistoryRepository.findOne(options);
    return JobHistoryMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<JobHistoryDTO>): Promise<[JobHistoryDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.jobHistoryRepository.findAndCount(options);
    const jobHistoryDTO: JobHistoryDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(jobHistory => jobHistoryDTO.push(JobHistoryMapper.fromEntityToDTO(jobHistory)));
      resultList[0] = jobHistoryDTO;
    }
    return resultList;
  }

  async save(jobHistoryDTO: JobHistoryDTO, creator?: string): Promise<JobHistoryDTO | undefined> {
    const entity = JobHistoryMapper.fromDTOtoEntity(jobHistoryDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.jobHistoryRepository.save(entity);
    return JobHistoryMapper.fromEntityToDTO(result);
  }

  async update(jobHistoryDTO: JobHistoryDTO, updater?: string): Promise<JobHistoryDTO | undefined> {
    const entity = JobHistoryMapper.fromDTOtoEntity(jobHistoryDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.jobHistoryRepository.save(entity);
    return JobHistoryMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.jobHistoryRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
