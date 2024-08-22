import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { DepartmentDTO } from '../src/service/dto/department.dto';
import { DepartmentService } from '../src/service/department.service';

describe('Department Controller', () => {
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
      .overrideProvider(DepartmentService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all departments ', async () => {
    const getEntities: DepartmentDTO[] = (await request(app.getHttpServer()).get('/api/departments').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET departments by id', async () => {
    const getEntity: DepartmentDTO = (
      await request(app.getHttpServer())
        .get('/api/departments/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create departments', async () => {
    const createdEntity: DepartmentDTO = (await request(app.getHttpServer()).post('/api/departments').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update departments', async () => {
    const updatedEntity: DepartmentDTO = (await request(app.getHttpServer()).put('/api/departments').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update departments from id', async () => {
    const updatedEntity: DepartmentDTO = (
      await request(app.getHttpServer())
        .put('/api/departments/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE departments', async () => {
    const deletedEntity: DepartmentDTO = (
      await request(app.getHttpServer())
        .delete('/api/departments/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
