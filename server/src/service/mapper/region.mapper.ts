import { Region } from '../../domain/region.entity';
import { RegionDTO } from '../dto/region.dto';

/**
 * A Region mapper object.
 */
export class RegionMapper {
  static fromDTOtoEntity(entityDTO: RegionDTO): Region {
    if (!entityDTO) {
      return;
    }
    let entity = new Region();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Region): RegionDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new RegionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
