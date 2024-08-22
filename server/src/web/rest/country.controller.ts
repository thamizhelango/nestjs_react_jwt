import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CountryDTO } from '../../service/dto/country.dto';
import { CountryService } from '../../service/country.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/countries')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('countries')
export class CountryController {
  logger = new Logger('CountryController');

  constructor(private readonly countryService: CountryService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: CountryDTO,
  })
  async getAll(@Req() req: Request): Promise<CountryDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.countryService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CountryDTO,
  })
  async getOne(@Param('id') id: number): Promise<CountryDTO> {
    return await this.countryService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create country' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CountryDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() countryDTO: CountryDTO): Promise<CountryDTO> {
    const created = await this.countryService.save(countryDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Country', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update country' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: CountryDTO,
  })
  async put(@Req() req: Request, @Body() countryDTO: CountryDTO): Promise<CountryDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Country', countryDTO.id);
    return await this.countryService.update(countryDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update country with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: CountryDTO,
  })
  async putId(@Req() req: Request, @Body() countryDTO: CountryDTO): Promise<CountryDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Country', countryDTO.id);
    return await this.countryService.update(countryDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete country' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Country', id);
    return await this.countryService.deleteById(id);
  }
}
