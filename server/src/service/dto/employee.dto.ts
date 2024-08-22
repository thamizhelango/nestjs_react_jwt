/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { JobDTO } from './job.dto';
import { DepartmentDTO } from './department.dto';
import { JobHistoryDTO } from './job-history.dto';

/**
 * A EmployeeDTO object.
 */
export class EmployeeDTO extends BaseDTO {
  @ApiProperty({ description: 'firstName field', required: false })
  firstName: string;

  @ApiProperty({ description: 'lastName field', required: false })
  lastName: string;

  @ApiProperty({ description: 'email field', required: false })
  email: string;

  @ApiProperty({ description: 'phoneNumber field', required: false })
  phoneNumber: string;

  @ApiProperty({ description: 'hireDate field', required: false })
  hireDate: any;

  @ApiProperty({ description: 'salary field', required: false })
  salary: number;

  @ApiProperty({ description: 'commissionPct field', required: false })
  commissionPct: number;

  @ApiProperty({ type: () => JobDTO, isArray: true, description: 'jobs relationship' })
  jobs: JobDTO[];

  @ApiProperty({ type: () => EmployeeDTO, description: 'manager relationship' })
  manager: EmployeeDTO;

  @ApiProperty({ type: () => DepartmentDTO, description: 'department relationship' })
  department: DepartmentDTO;

  @ApiProperty({ type: () => JobHistoryDTO, description: 'jobHistory relationship' })
  jobHistory: JobHistoryDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
