/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { RegionDTO } from './region.dto';
import { LocationDTO } from './location.dto';

/**
 * A CountryDTO object.
 */
export class CountryDTO extends BaseDTO {
  @ApiProperty({ description: 'countryName field', required: false })
  countryName: string;

  @ApiProperty({ type: () => RegionDTO, description: 'region relationship' })
  region: RegionDTO;

  @ApiProperty({ type: () => LocationDTO, description: 'location relationship' })
  location: LocationDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
