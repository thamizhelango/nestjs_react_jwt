import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { LocationDTO } from '../src/service/dto/location.dto';
import { LocationService } from '../src/service/location.service';

describe('Location Controller', () => {
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
      .overrideProvider(LocationService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all locations ', async () => {
    const getEntities: LocationDTO[] = (await request(app.getHttpServer()).get('/api/locations').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET locations by id', async () => {
    const getEntity: LocationDTO = (
      await request(app.getHttpServer())
        .get('/api/locations/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create locations', async () => {
    const createdEntity: LocationDTO = (await request(app.getHttpServer()).post('/api/locations').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update locations', async () => {
    const updatedEntity: LocationDTO = (await request(app.getHttpServer()).put('/api/locations').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update locations from id', async () => {
    const updatedEntity: LocationDTO = (
      await request(app.getHttpServer())
        .put('/api/locations/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE locations', async () => {
    const deletedEntity: LocationDTO = (
      await request(app.getHttpServer())
        .delete('/api/locations/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
