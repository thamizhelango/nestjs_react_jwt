import { Country } from '../../domain/country.entity';
import { CountryDTO } from '../dto/country.dto';

/**
 * A Country mapper object.
 */
export class CountryMapper {
  static fromDTOtoEntity(entityDTO: CountryDTO): Country {
    if (!entityDTO) {
      return;
    }
    let entity = new Country();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Country): CountryDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new CountryDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
