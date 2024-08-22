/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToOne, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Task } from './task.entity';
import { Employee } from './employee.entity';
import { JobHistory } from './job-history.entity';

/**
 * A Job.
 */
@Entity('job')
export class Job extends BaseEntity {
  @Column({ name: 'job_title', nullable: true })
  jobTitle: string;

  @Column({ type: 'double precision', name: 'min_salary', nullable: true })
  minSalary: number;

  @Column({ type: 'double precision', name: 'max_salary', nullable: true })
  maxSalary: number;

  @ManyToMany(type => Task)
  @JoinTable({
    name: 'rel_job__task',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'task_id', referencedColumnName: 'id' },
  })
  tasks: Task[];

  @ManyToOne(type => Employee)
  employee: Employee;

  @OneToOne(type => JobHistory)
  jobHistory: JobHistory;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
