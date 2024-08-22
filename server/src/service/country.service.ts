import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CountryDTO } from '../service/dto/country.dto';
import { CountryMapper } from '../service/mapper/country.mapper';
import { CountryRepository } from '../repository/country.repository';

const relationshipNames = [];

@Injectable()
export class CountryService {
  logger = new Logger('CountryService');

  constructor(@InjectRepository(CountryRepository) private countryRepository: CountryRepository) {}

  async findById(id: number): Promise<CountryDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.countryRepository.findOne(id, options);
    return CountryMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<CountryDTO>): Promise<CountryDTO | undefined> {
    const result = await this.countryRepository.findOne(options);
    return CountryMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<CountryDTO>): Promise<[CountryDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.countryRepository.findAndCount(options);
    const countryDTO: CountryDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(country => countryDTO.push(CountryMapper.fromEntityToDTO(country)));
      resultList[0] = countryDTO;
    }
    return resultList;
  }

  async save(countryDTO: CountryDTO, creator?: string): Promise<CountryDTO | undefined> {
    const entity = CountryMapper.fromDTOtoEntity(countryDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.countryRepository.save(entity);
    return CountryMapper.fromEntityToDTO(result);
  }

  async update(countryDTO: CountryDTO, updater?: string): Promise<CountryDTO | undefined> {
    const entity = CountryMapper.fromDTOtoEntity(countryDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.countryRepository.save(entity);
    return CountryMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.countryRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
