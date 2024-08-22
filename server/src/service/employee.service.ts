import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { EmployeeDTO } from '../service/dto/employee.dto';
import { EmployeeMapper } from '../service/mapper/employee.mapper';
import { EmployeeRepository } from '../repository/employee.repository';

const relationshipNames = [];
relationshipNames.push('manager');
relationshipNames.push('department');

@Injectable()
export class EmployeeService {
  logger = new Logger('EmployeeService');

  constructor(@InjectRepository(EmployeeRepository) private employeeRepository: EmployeeRepository) {}

  async findById(id: number): Promise<EmployeeDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.employeeRepository.findOne(id, options);
    return EmployeeMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<EmployeeDTO>): Promise<EmployeeDTO | undefined> {
    const result = await this.employeeRepository.findOne(options);
    return EmployeeMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<EmployeeDTO>): Promise<[EmployeeDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.employeeRepository.findAndCount(options);
    const employeeDTO: EmployeeDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(employee => employeeDTO.push(EmployeeMapper.fromEntityToDTO(employee)));
      resultList[0] = employeeDTO;
    }
    return resultList;
  }

  async save(employeeDTO: EmployeeDTO, creator?: string): Promise<EmployeeDTO | undefined> {
    const entity = EmployeeMapper.fromDTOtoEntity(employeeDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.employeeRepository.save(entity);
    return EmployeeMapper.fromEntityToDTO(result);
  }

  async update(employeeDTO: EmployeeDTO, updater?: string): Promise<EmployeeDTO | undefined> {
    const entity = EmployeeMapper.fromDTOtoEntity(employeeDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.employeeRepository.save(entity);
    return EmployeeMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.employeeRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
