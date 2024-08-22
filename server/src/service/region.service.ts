import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RegionDTO } from '../service/dto/region.dto';
import { RegionMapper } from '../service/mapper/region.mapper';
import { RegionRepository } from '../repository/region.repository';

const relationshipNames = [];

@Injectable()
export class RegionService {
  logger = new Logger('RegionService');

  constructor(@InjectRepository(RegionRepository) private regionRepository: RegionRepository) {}

  async findById(id: number): Promise<RegionDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.regionRepository.findOne(id, options);
    return RegionMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<RegionDTO>): Promise<RegionDTO | undefined> {
    const result = await this.regionRepository.findOne(options);
    return RegionMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<RegionDTO>): Promise<[RegionDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.regionRepository.findAndCount(options);
    const regionDTO: RegionDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(region => regionDTO.push(RegionMapper.fromEntityToDTO(region)));
      resultList[0] = regionDTO;
    }
    return resultList;
  }

  async save(regionDTO: RegionDTO, creator?: string): Promise<RegionDTO | undefined> {
    const entity = RegionMapper.fromDTOtoEntity(regionDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.regionRepository.save(entity);
    return RegionMapper.fromEntityToDTO(result);
  }

  async update(regionDTO: RegionDTO, updater?: string): Promise<RegionDTO | undefined> {
    const entity = RegionMapper.fromDTOtoEntity(regionDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.regionRepository.save(entity);
    return RegionMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.regionRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
