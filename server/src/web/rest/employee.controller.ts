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
import { EmployeeDTO } from '../../service/dto/employee.dto';
import { EmployeeService } from '../../service/employee.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/employees')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('employees')
export class EmployeeController {
  logger = new Logger('EmployeeController');

  constructor(private readonly employeeService: EmployeeService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: EmployeeDTO,
  })
  async getAll(@Req() req: Request): Promise<EmployeeDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.employeeService.findAndCount({
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
    type: EmployeeDTO,
  })
  async getOne(@Param('id') id: number): Promise<EmployeeDTO> {
    return await this.employeeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create employee' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: EmployeeDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() employeeDTO: EmployeeDTO): Promise<EmployeeDTO> {
    const created = await this.employeeService.save(employeeDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Employee', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update employee' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: EmployeeDTO,
  })
  async put(@Req() req: Request, @Body() employeeDTO: EmployeeDTO): Promise<EmployeeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Employee', employeeDTO.id);
    return await this.employeeService.update(employeeDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update employee with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: EmployeeDTO,
  })
  async putId(@Req() req: Request, @Body() employeeDTO: EmployeeDTO): Promise<EmployeeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Employee', employeeDTO.id);
    return await this.employeeService.update(employeeDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete employee' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Employee', id);
    return await this.employeeService.deleteById(id);
  }
}
