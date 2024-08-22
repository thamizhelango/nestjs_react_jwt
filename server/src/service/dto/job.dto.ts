/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { TaskDTO } from './task.dto';
import { EmployeeDTO } from './employee.dto';
import { JobHistoryDTO } from './job-history.dto';

/**
 * A JobDTO object.
 */
export class JobDTO extends BaseDTO {
  @ApiProperty({ description: 'jobTitle field', required: false })
  jobTitle: string;

  @ApiProperty({ description: 'minSalary field', required: false })
  minSalary: number;

  @ApiProperty({ description: 'maxSalary field', required: false })
  maxSalary: number;

  @ApiProperty({ type: () => TaskDTO, isArray: true, description: 'tasks relationship' })
  tasks: TaskDTO[];

  @ApiProperty({ type: () => EmployeeDTO, description: 'employee relationship' })
  employee: EmployeeDTO;

  @ApiProperty({ type: () => JobHistoryDTO, description: 'jobHistory relationship' })
  jobHistory: JobHistoryDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
