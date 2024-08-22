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
import { DepartmentDTO } from '../../service/dto/department.dto';
import { DepartmentService } from '../../service/department.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/departments')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('departments')
export class DepartmentController {
  logger = new Logger('DepartmentController');

  constructor(private readonly departmentService: DepartmentService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: DepartmentDTO,
  })
  async getAll(@Req() req: Request): Promise<DepartmentDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.departmentService.findAndCount({
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
    type: DepartmentDTO,
  })
  async getOne(@Param('id') id: number): Promise<DepartmentDTO> {
    return await this.departmentService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create department' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: DepartmentDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() departmentDTO: DepartmentDTO): Promise<DepartmentDTO> {
    const created = await this.departmentService.save(departmentDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Department', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update department' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DepartmentDTO,
  })
  async put(@Req() req: Request, @Body() departmentDTO: DepartmentDTO): Promise<DepartmentDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Department', departmentDTO.id);
    return await this.departmentService.update(departmentDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update department with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DepartmentDTO,
  })
  async putId(@Req() req: Request, @Body() departmentDTO: DepartmentDTO): Promise<DepartmentDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Department', departmentDTO.id);
    return await this.departmentService.update(departmentDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete department' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Department', id);
    return await this.departmentService.deleteById(id);
  }
}
