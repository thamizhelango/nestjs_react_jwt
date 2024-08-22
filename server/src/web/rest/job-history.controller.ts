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
import { JobHistoryDTO } from '../../service/dto/job-history.dto';
import { JobHistoryService } from '../../service/job-history.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/job-histories')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('job-histories')
export class JobHistoryController {
  logger = new Logger('JobHistoryController');

  constructor(private readonly jobHistoryService: JobHistoryService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: JobHistoryDTO,
  })
  async getAll(@Req() req: Request): Promise<JobHistoryDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.jobHistoryService.findAndCount({
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
    type: JobHistoryDTO,
  })
  async getOne(@Param('id') id: number): Promise<JobHistoryDTO> {
    return await this.jobHistoryService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create jobHistory' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: JobHistoryDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() jobHistoryDTO: JobHistoryDTO): Promise<JobHistoryDTO> {
    const created = await this.jobHistoryService.save(jobHistoryDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'JobHistory', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update jobHistory' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: JobHistoryDTO,
  })
  async put(@Req() req: Request, @Body() jobHistoryDTO: JobHistoryDTO): Promise<JobHistoryDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'JobHistory', jobHistoryDTO.id);
    return await this.jobHistoryService.update(jobHistoryDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update jobHistory with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: JobHistoryDTO,
  })
  async putId(@Req() req: Request, @Body() jobHistoryDTO: JobHistoryDTO): Promise<JobHistoryDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'JobHistory', jobHistoryDTO.id);
    return await this.jobHistoryService.update(jobHistoryDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete jobHistory' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'JobHistory', id);
    return await this.jobHistoryService.deleteById(id);
  }
}
