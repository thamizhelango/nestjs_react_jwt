import { JobHistory } from '../../domain/job-history.entity';
import { JobHistoryDTO } from '../dto/job-history.dto';

/**
 * A JobHistory mapper object.
 */
export class JobHistoryMapper {
  static fromDTOtoEntity(entityDTO: JobHistoryDTO): JobHistory {
    if (!entityDTO) {
      return;
    }
    let entity = new JobHistory();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: JobHistory): JobHistoryDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new JobHistoryDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
