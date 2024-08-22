/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { CountryDTO } from './country.dto';

/**
 * A RegionDTO object.
 */
export class RegionDTO extends BaseDTO {
  @ApiProperty({ description: 'regionName field', required: false })
  regionName: string;

  @ApiProperty({ type: () => CountryDTO, description: 'country relationship' })
  country: CountryDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
