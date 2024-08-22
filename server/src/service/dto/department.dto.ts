/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { LocationDTO } from './location.dto';
import { EmployeeDTO } from './employee.dto';
import { JobHistoryDTO } from './job-history.dto';

/**
 * A DepartmentDTO object.
 */
export class DepartmentDTO extends BaseDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'departmentName field' })
  departmentName: string;

  @ApiProperty({ type: () => LocationDTO, description: 'location relationship' })
  location: LocationDTO;

  @ApiProperty({ type: () => EmployeeDTO, isArray: true, description: 'employees relationship' })
  employees: EmployeeDTO[];

  @ApiProperty({ type: () => JobHistoryDTO, description: 'jobHistory relationship' })
  jobHistory: JobHistoryDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
