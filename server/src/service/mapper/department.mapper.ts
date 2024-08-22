import { Department } from '../../domain/department.entity';
import { DepartmentDTO } from '../dto/department.dto';

/**
 * A Department mapper object.
 */
export class DepartmentMapper {
  static fromDTOtoEntity(entityDTO: DepartmentDTO): Department {
    if (!entityDTO) {
      return;
    }
    let entity = new Department();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Department): DepartmentDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new DepartmentDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
