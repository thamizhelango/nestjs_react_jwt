import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { JobDTO } from '../src/service/dto/job.dto';
import { JobService } from '../src/service/job.service';

describe('Job Controller', () => {
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
      .overrideProvider(JobService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all jobs ', async () => {
    const getEntities: JobDTO[] = (await request(app.getHttpServer()).get('/api/jobs').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET jobs by id', async () => {
    const getEntity: JobDTO = (
      await request(app.getHttpServer())
        .get('/api/jobs/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create jobs', async () => {
    const createdEntity: JobDTO = (await request(app.getHttpServer()).post('/api/jobs').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update jobs', async () => {
    const updatedEntity: JobDTO = (await request(app.getHttpServer()).put('/api/jobs').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update jobs from id', async () => {
    const updatedEntity: JobDTO = (
      await request(app.getHttpServer())
        .put('/api/jobs/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE jobs', async () => {
    const deletedEntity: JobDTO = (
      await request(app.getHttpServer())
        .delete('/api/jobs/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
