import { EntityRepository, Repository } from 'typeorm';
import { JobHistory } from '../domain/job-history.entity';

@EntityRepository(JobHistory)
export class JobHistoryRepository extends Repository<JobHistory> {}
