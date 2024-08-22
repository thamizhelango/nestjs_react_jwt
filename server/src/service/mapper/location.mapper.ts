import { Location } from '../../domain/location.entity';
import { LocationDTO } from '../dto/location.dto';

/**
 * A Location mapper object.
 */
export class LocationMapper {
  static fromDTOtoEntity(entityDTO: LocationDTO): Location {
    if (!entityDTO) {
      return;
    }
    let entity = new Location();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Location): LocationDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new LocationDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
