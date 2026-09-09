import { Controller, Get, Post, Patch, Put, Param, Body, Query, UsePipes, UseGuards, ValidationPipe } from '@nestjs/common';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { ChangeUserStatusUseCase } from '../../../application/use-cases/change-user-status.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/update-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateStatusDto } from './dto/change-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdParamDto } from './dto/id-param.dto';
import { AuthApiGuard } from '../../../common/guards/auth-api.guards';

@Controller('users')
export class UserController {
  constructor(
    private readonly listUsers: ListUsersUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly changeUserStatus: ChangeUserStatusUseCase,
    private readonly updateUser: UpdateUserUseCase,
  ) {}

  // 🔓 Ruta PÚBLICA: No requiere token para poder registrarse
  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.createUser.execute(body);
  }

  // 🔒 Rutas PROTEGIDAS: Exigen el token mediante el guardia
  @UseGuards(AuthApiGuard)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) 
  async getAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return await this.listUsers.execute(page, limit);
  }

  @UseGuards(AuthApiGuard)
  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async changeStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto
  ) {
    return await this.changeUserStatus.execute(id, updateStatusDto.status);
  }

  @UseGuards(AuthApiGuard)
  @Put(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() body: UpdateUserDto
  ) {
    return await this.updateUser.execute(body, params.id);
  }
}