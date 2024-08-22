/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Job } from './job.entity';
import { Department } from './department.entity';
import { Employee } from './employee.entity';
import { Language } from './enumeration/language';

/**
 * A JobHistory.
 */
@Entity('job_history')
export class JobHistory extends BaseEntity {
  @Column({ type: 'timestamp', name: 'start_date', nullable: true })
  startDate: any;

  @Column({ type: 'timestamp', name: 'end_date', nullable: true })
  endDate: any;

  @Column({ type: 'simple-enum', name: 'language', enum: Language })
  language: Language;

  @OneToOne(type => Job)
  @JoinColumn()
  job: Job;

  @OneToOne(type => Department)
  @JoinColumn()
  department: Department;

  @OneToOne(type => Employee)
  @JoinColumn()
  employee: Employee;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
