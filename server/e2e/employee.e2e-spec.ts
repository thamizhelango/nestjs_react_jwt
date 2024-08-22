import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { EmployeeDTO } from '../src/service/dto/employee.dto';
import { EmployeeService } from '../src/service/employee.service';

describe('Employee Controller', () => {
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
      .overrideProvider(EmployeeService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all employees ', async () => {
    const getEntities: EmployeeDTO[] = (await request(app.getHttpServer()).get('/api/employees').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET employees by id', async () => {
    const getEntity: EmployeeDTO = (
      await request(app.getHttpServer())
        .get('/api/employees/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create employees', async () => {
    const createdEntity: EmployeeDTO = (await request(app.getHttpServer()).post('/api/employees').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update employees', async () => {
    const updatedEntity: EmployeeDTO = (await request(app.getHttpServer()).put('/api/employees').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update employees from id', async () => {
    const updatedEntity: EmployeeDTO = (
      await request(app.getHttpServer())
        .put('/api/employees/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE employees', async () => {
    const deletedEntity: EmployeeDTO = (
      await request(app.getHttpServer())
        .delete('/api/employees/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
