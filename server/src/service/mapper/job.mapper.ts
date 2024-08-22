import { Job } from '../../domain/job.entity';
import { JobDTO } from '../dto/job.dto';

/**
 * A Job mapper object.
 */
export class JobMapper {
  static fromDTOtoEntity(entityDTO: JobDTO): Job {
    if (!entityDTO) {
      return;
    }
    let entity = new Job();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Job): JobDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new JobDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
