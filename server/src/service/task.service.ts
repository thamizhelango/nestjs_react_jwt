import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TaskDTO } from '../service/dto/task.dto';
import { TaskMapper } from '../service/mapper/task.mapper';
import { TaskRepository } from '../repository/task.repository';

const relationshipNames = [];

@Injectable()
export class TaskService {
  logger = new Logger('TaskService');

  constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

  async findById(id: number): Promise<TaskDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.taskRepository.findOne(id, options);
    return TaskMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<TaskDTO>): Promise<TaskDTO | undefined> {
    const result = await this.taskRepository.findOne(options);
    return TaskMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<TaskDTO>): Promise<[TaskDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.taskRepository.findAndCount(options);
    const taskDTO: TaskDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(task => taskDTO.push(TaskMapper.fromEntityToDTO(task)));
      resultList[0] = taskDTO;
    }
    return resultList;
  }

  async save(taskDTO: TaskDTO, creator?: string): Promise<TaskDTO | undefined> {
    const entity = TaskMapper.fromDTOtoEntity(taskDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.taskRepository.save(entity);
    return TaskMapper.fromEntityToDTO(result);
  }

  async update(taskDTO: TaskDTO, updater?: string): Promise<TaskDTO | undefined> {
    const entity = TaskMapper.fromDTOtoEntity(taskDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.taskRepository.save(entity);
    return TaskMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.taskRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
