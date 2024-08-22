/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Country } from './country.entity';
import { Department } from './department.entity';

/**
 * A Location.
 */
@Entity('location')
export class Location extends BaseEntity {
  @Column({ name: 'street_address', nullable: true })
  streetAddress: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ name: 'city', nullable: true })
  city: string;

  @Column({ name: 'state_province', nullable: true })
  stateProvince: string;

  @OneToOne(type => Country)
  @JoinColumn()
  country: Country;

  @OneToOne(type => Department)
  department: Department;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
