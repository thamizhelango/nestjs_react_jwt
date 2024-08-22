/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Job } from './job.entity';
import { Department } from './department.entity';
import { JobHistory } from './job-history.entity';

/**
 * A Employee.
 */
@Entity('employee')
export class Employee extends BaseEntity {
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ type: 'timestamp', name: 'hire_date', nullable: true })
  hireDate: any;

  @Column({ type: 'double precision', name: 'salary', nullable: true })
  salary: number;

  @Column({ type: 'double precision', name: 'commission_pct', nullable: true })
  commissionPct: number;

  @OneToMany(type => Job, other => other.employee)
  jobs: Job[];

  @ManyToOne(type => Employee)
  manager: Employee;

  @ManyToOne(type => Department)
  department: Department;

  @OneToOne(type => JobHistory)
  jobHistory: JobHistory;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
