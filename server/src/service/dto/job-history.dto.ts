/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { Language } from '../../domain/enumeration/language';
import { BaseDTO } from './base.dto';

import { JobDTO } from './job.dto';
import { DepartmentDTO } from './department.dto';
import { EmployeeDTO } from './employee.dto';

/**
 * A JobHistoryDTO object.
 */
export class JobHistoryDTO extends BaseDTO {
  @ApiProperty({ description: 'startDate field', required: false })
  startDate: any;

  @ApiProperty({ description: 'endDate field', required: false })
  endDate: any;

  @ApiProperty({ enum: Language, description: 'language enum field', required: false })
  language: Language;

  @ApiProperty({ type: () => JobDTO, description: 'job relationship' })
  job: JobDTO;

  @ApiProperty({ type: () => DepartmentDTO, description: 'department relationship' })
  department: DepartmentDTO;

  @ApiProperty({ type: () => EmployeeDTO, description: 'employee relationship' })
  employee: EmployeeDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
