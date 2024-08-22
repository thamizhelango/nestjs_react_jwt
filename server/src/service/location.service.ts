import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { LocationDTO } from '../service/dto/location.dto';
import { LocationMapper } from '../service/mapper/location.mapper';
import { LocationRepository } from '../repository/location.repository';

const relationshipNames = [];

@Injectable()
export class LocationService {
  logger = new Logger('LocationService');

  constructor(@InjectRepository(LocationRepository) private locationRepository: LocationRepository) {}

  async findById(id: number): Promise<LocationDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.locationRepository.findOne(id, options);
    return LocationMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<LocationDTO>): Promise<LocationDTO | undefined> {
    const result = await this.locationRepository.findOne(options);
    return LocationMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<LocationDTO>): Promise<[LocationDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.locationRepository.findAndCount(options);
    const locationDTO: LocationDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(location => locationDTO.push(LocationMapper.fromEntityToDTO(location)));
      resultList[0] = locationDTO;
    }
    return resultList;
  }

  async save(locationDTO: LocationDTO, creator?: string): Promise<LocationDTO | undefined> {
    const entity = LocationMapper.fromDTOtoEntity(locationDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.locationRepository.save(entity);
    return LocationMapper.fromEntityToDTO(result);
  }

  async update(locationDTO: LocationDTO, updater?: string): Promise<LocationDTO | undefined> {
    const entity = LocationMapper.fromDTOtoEntity(locationDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.locationRepository.save(entity);
    return LocationMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.locationRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
