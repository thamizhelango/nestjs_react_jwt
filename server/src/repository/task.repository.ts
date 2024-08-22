import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../domain/task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}
