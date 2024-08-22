/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Country } from './country.entity';

/**
 * A Region.
 */
@Entity('region')
export class Region extends BaseEntity {
  @Column({ name: 'region_name', nullable: true })
  regionName: string;

  @OneToOne(type => Country)
  country: Country;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
