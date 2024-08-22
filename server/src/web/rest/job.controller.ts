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
import { JobDTO } from '../../service/dto/job.dto';
import { JobService } from '../../service/job.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/jobs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('jobs')
export class JobController {
  logger = new Logger('JobController');

  constructor(private readonly jobService: JobService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: JobDTO,
  })
  async getAll(@Req() req: Request): Promise<JobDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.jobService.findAndCount({
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
    type: JobDTO,
  })
  async getOne(@Param('id') id: number): Promise<JobDTO> {
    return await this.jobService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create job' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: JobDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() jobDTO: JobDTO): Promise<JobDTO> {
    const created = await this.jobService.save(jobDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Job', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update job' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: JobDTO,
  })
  async put(@Req() req: Request, @Body() jobDTO: JobDTO): Promise<JobDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Job', jobDTO.id);
    return await this.jobService.update(jobDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update job with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: JobDTO,
  })
  async putId(@Req() req: Request, @Body() jobDTO: JobDTO): Promise<JobDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Job', jobDTO.id);
    return await this.jobService.update(jobDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete job' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Job', id);
    return await this.jobService.deleteById(id);
  }
}
