import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from '../web/rest/country.controller';
import { CountryRepository } from '../repository/country.repository';
import { CountryService } from '../service/country.service';

@Module({
  imports: [TypeOrmModule.forFeature([CountryRepository])],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
