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
import { TaskDTO } from '../../service/dto/task.dto';
import { TaskService } from '../../service/task.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tasks')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('tasks')
export class TaskController {
  logger = new Logger('TaskController');

  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TaskDTO,
  })
  async getAll(@Req() req: Request): Promise<TaskDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.taskService.findAndCount({
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
    type: TaskDTO,
  })
  async getOne(@Param('id') id: number): Promise<TaskDTO> {
    return await this.taskService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TaskDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() taskDTO: TaskDTO): Promise<TaskDTO> {
    const created = await this.taskService.save(taskDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Task', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TaskDTO,
  })
  async put(@Req() req: Request, @Body() taskDTO: TaskDTO): Promise<TaskDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Task', taskDTO.id);
    return await this.taskService.update(taskDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update task with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TaskDTO,
  })
  async putId(@Req() req: Request, @Body() taskDTO: TaskDTO): Promise<TaskDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Task', taskDTO.id);
    return await this.taskService.update(taskDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Task', id);
    return await this.taskService.deleteById(id);
  }
}
