import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { JobHistoryDTO } from '../src/service/dto/job-history.dto';
import { JobHistoryService } from '../src/service/job-history.service';

describe('JobHistory Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId',
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    deleteById: (): any => entityMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(JobHistoryService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all job-histories ', async () => {
    const getEntities: JobHistoryDTO[] = (await request(app.getHttpServer()).get('/api/job-histories').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET job-histories by id', async () => {
    const getEntity: JobHistoryDTO = (
      await request(app.getHttpServer())
        .get('/api/job-histories/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create job-histories', async () => {
    const createdEntity: JobHistoryDTO = (await request(app.getHttpServer()).post('/api/job-histories').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update job-histories', async () => {
    const updatedEntity: JobHistoryDTO = (await request(app.getHttpServer()).put('/api/job-histories').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update job-histories from id', async () => {
    const updatedEntity: JobHistoryDTO = (
      await request(app.getHttpServer())
        .put('/api/job-histories/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE job-histories', async () => {
    const deletedEntity: JobHistoryDTO = (
      await request(app.getHttpServer())
        .delete('/api/job-histories/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
