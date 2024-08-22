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
import { LocationDTO } from '../../service/dto/location.dto';
import { LocationService } from '../../service/location.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/locations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('locations')
export class LocationController {
  logger = new Logger('LocationController');

  constructor(private readonly locationService: LocationService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: LocationDTO,
  })
  async getAll(@Req() req: Request): Promise<LocationDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.locationService.findAndCount({
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
    type: LocationDTO,
  })
  async getOne(@Param('id') id: number): Promise<LocationDTO> {
    return await this.locationService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create location' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: LocationDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() locationDTO: LocationDTO): Promise<LocationDTO> {
    const created = await this.locationService.save(locationDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update location' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: LocationDTO,
  })
  async put(@Req() req: Request, @Body() locationDTO: LocationDTO): Promise<LocationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', locationDTO.id);
    return await this.locationService.update(locationDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update location with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: LocationDTO,
  })
  async putId(@Req() req: Request, @Body() locationDTO: LocationDTO): Promise<LocationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Location', locationDTO.id);
    return await this.locationService.update(locationDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete location' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Location', id);
    return await this.locationService.deleteById(id);
  }
}
