/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { JobDTO } from './job.dto';

/**
 * A TaskDTO object.
 */
export class TaskDTO extends BaseDTO {
  @ApiProperty({ description: 'title field', required: false })
  title: string;

  @ApiProperty({ description: 'description field', required: false })
  description: string;

  @ApiProperty({ type: () => JobDTO, isArray: true, description: 'jobs relationship' })
  jobs: JobDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
