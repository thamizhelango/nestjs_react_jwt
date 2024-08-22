/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { CountryDTO } from './country.dto';
import { DepartmentDTO } from './department.dto';

/**
 * A LocationDTO object.
 */
export class LocationDTO extends BaseDTO {
  @ApiProperty({ description: 'streetAddress field', required: false })
  streetAddress: string;

  @ApiProperty({ description: 'postalCode field', required: false })
  postalCode: string;

  @ApiProperty({ description: 'city field', required: false })
  city: string;

  @ApiProperty({ description: 'stateProvince field', required: false })
  stateProvince: string;

  @ApiProperty({ type: () => CountryDTO, description: 'country relationship' })
  country: CountryDTO;

  @ApiProperty({ type: () => DepartmentDTO, description: 'department relationship' })
  department: DepartmentDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
