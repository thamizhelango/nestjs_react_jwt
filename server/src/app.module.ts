import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { config } from './config';
import { RegionModule } from './module/region.module';
import { CountryModule } from './module/country.module';
import { LocationModule } from './module/location.module';
import { DepartmentModule } from './module/department.module';
import { TaskModule } from './module/task.module';
import { EmployeeModule } from './module/employee.module';
import { JobModule } from './module/job.module';
import { JobHistoryModule } from './module/job-history.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    ServeStaticModule.forRoot({
      rootPath: config.getClientPath(),
    }),
    AuthModule,
    RegionModule,
    CountryModule,
    LocationModule,
    DepartmentModule,
    TaskModule,
    EmployeeModule,
    JobModule,
    JobHistoryModule,
    // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
  ],
  controllers: [
    // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
  ],
  providers: [
    // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
  ],
})
export class AppModule {}
