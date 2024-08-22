import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobHistoryController } from '../web/rest/job-history.controller';
import { JobHistoryRepository } from '../repository/job-history.repository';
import { JobHistoryService } from '../service/job-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobHistoryRepository])],
  controllers: [JobHistoryController],
  providers: [JobHistoryService],
  exports: [JobHistoryService],
})
export class JobHistoryModule {}
