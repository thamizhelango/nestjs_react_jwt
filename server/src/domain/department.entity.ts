/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Location } from './location.entity';
import { Employee } from './employee.entity';
import { JobHistory } from './job-history.entity';

/**
 * A Department.
 */
@Entity('department')
export class Department extends BaseEntity {
  @Column({ name: 'department_name' })
  departmentName: string;

  @OneToOne(type => Location)
  @JoinColumn()
  location: Location;

  @OneToMany(type => Employee, other => other.department)
  employees: Employee[];

  @OneToOne(type => JobHistory)
  jobHistory: JobHistory;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
