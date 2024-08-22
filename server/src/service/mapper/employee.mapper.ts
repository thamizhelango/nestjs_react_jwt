import { Employee } from '../../domain/employee.entity';
import { EmployeeDTO } from '../dto/employee.dto';

/**
 * A Employee mapper object.
 */
export class EmployeeMapper {
  static fromDTOtoEntity(entityDTO: EmployeeDTO): Employee {
    if (!entityDTO) {
      return;
    }
    let entity = new Employee();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Employee): EmployeeDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new EmployeeDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
