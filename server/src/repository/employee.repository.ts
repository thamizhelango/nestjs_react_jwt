import { EntityRepository, Repository } from 'typeorm';
import { Employee } from '../domain/employee.entity';

@EntityRepository(Employee)
export class EmployeeRepository extends Repository<Employee> {}
