import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DepartmentDTO } from '../service/dto/department.dto';
import { DepartmentMapper } from '../service/mapper/department.mapper';
import { DepartmentRepository } from '../repository/department.repository';

const relationshipNames = [];

@Injectable()
export class DepartmentService {
  logger = new Logger('DepartmentService');

  constructor(@InjectRepository(DepartmentRepository) private departmentRepository: DepartmentRepository) {}

  async findById(id: number): Promise<DepartmentDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.departmentRepository.findOne(id, options);
    return DepartmentMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<DepartmentDTO>): Promise<DepartmentDTO | undefined> {
    const result = await this.departmentRepository.findOne(options);
    return DepartmentMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<DepartmentDTO>): Promise<[DepartmentDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.departmentRepository.findAndCount(options);
    const departmentDTO: DepartmentDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(department => departmentDTO.push(DepartmentMapper.fromEntityToDTO(department)));
      resultList[0] = departmentDTO;
    }
    return resultList;
  }

  async save(departmentDTO: DepartmentDTO, creator?: string): Promise<DepartmentDTO | undefined> {
    const entity = DepartmentMapper.fromDTOtoEntity(departmentDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.departmentRepository.save(entity);
    return DepartmentMapper.fromEntityToDTO(result);
  }

  async update(departmentDTO: DepartmentDTO, updater?: string): Promise<DepartmentDTO | undefined> {
    const entity = DepartmentMapper.fromDTOtoEntity(departmentDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.departmentRepository.save(entity);
    return DepartmentMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.departmentRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
