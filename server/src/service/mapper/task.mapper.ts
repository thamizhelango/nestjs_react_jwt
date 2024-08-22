import { Task } from '../../domain/task.entity';
import { TaskDTO } from '../dto/task.dto';

/**
 * A Task mapper object.
 */
export class TaskMapper {
  static fromDTOtoEntity(entityDTO: TaskDTO): Task {
    if (!entityDTO) {
      return;
    }
    let entity = new Task();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Task): TaskDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new TaskDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
