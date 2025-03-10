import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { CountryDTO } from '../src/service/dto/country.dto';
import { CountryService } from '../src/service/country.service';

describe('Country Controller', () => {
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
      .overrideProvider(CountryService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all countries ', async () => {
    const getEntities: CountryDTO[] = (await request(app.getHttpServer()).get('/api/countries').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET countries by id', async () => {
    const getEntity: CountryDTO = (
      await request(app.getHttpServer())
        .get('/api/countries/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create countries', async () => {
    const createdEntity: CountryDTO = (await request(app.getHttpServer()).post('/api/countries').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update countries', async () => {
    const updatedEntity: CountryDTO = (await request(app.getHttpServer()).put('/api/countries').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update countries from id', async () => {
    const updatedEntity: CountryDTO = (
      await request(app.getHttpServer())
        .put('/api/countries/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE countries', async () => {
    const deletedEntity: CountryDTO = (
      await request(app.getHttpServer())
        .delete('/api/countries/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
