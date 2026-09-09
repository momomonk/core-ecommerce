import { Controller, Get, Post, Patch, Put, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ListBusinessesUseCase } from '../../../application/use-cases/list-businesses.use-case';
import { CreateBusinessUseCase } from '../../../application/use-cases/create-business.use-case';
import { GetBusinessUseCase } from '../../../application/use-cases/get-business.use-case';
import { ChangeBusinessNameUseCase } from 'src/application/use-cases/change-business-name.use-case';
import { ChangeBusinessSlugUseCase } from 'src/application/use-cases/change-business-slug.use-case';
import { ChangeBusinessStatusUseCase } from '../../../application/use-cases/change-business-status.use-case';
import { UpdateBusinessUseCase } from '../../../application/use-cases/update-business.use-case';
import { CreateBusinessDto } from './dto/create-business.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ChangeBusinessNameDto } from './dto/change-business-name.dto';
import { ChangeBusinessSlugDto } from './dto/change-business-slug.dto';
import { ChangeBusinessStatusDto } from './dto/change-business-status.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { IdParamDto } from './dto/id-param.dto';

@Controller('businesses')
export class BusinessController {
  constructor(
    private readonly listBusinesses: ListBusinessesUseCase,
    private readonly createBusiness: CreateBusinessUseCase,
    private readonly changeBusinessStatus: ChangeBusinessStatusUseCase,
    private readonly changeBusinessSlug: ChangeBusinessSlugUseCase,
    private readonly changeBusinessName: ChangeBusinessNameUseCase,
    private readonly updateBusiness: UpdateBusinessUseCase,
    private readonly getBusiness: GetBusinessUseCase, 
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) 
  async getAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return await this.listBusinesses.execute(page, limit);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async findBusiness(
    @Param('id') id: string
  ) {
    return await this.getBusiness.execute(id);
  }

  @Post()
  async create(@Body() body: CreateBusinessDto) {
    return await this.createBusiness.execute(body);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async changeStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: ChangeBusinessStatusDto
  ) {
    return await this.changeBusinessStatus.execute(id, updateStatusDto.status);
  }

  @Patch(':id/name')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async changeName(
    @Param('id') id: string,
    @Body() updateNameDto: ChangeBusinessNameDto
  ) {
    return await this.changeBusinessName.execute(id, updateNameDto.name);
  }

  @Patch(':id/slug')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async changeSlug(
    @Param('id') id: string,
    @Body() updateSlugDto: ChangeBusinessSlugDto
  ) {
    return await this.changeBusinessSlug.execute(id, updateSlugDto.slug);
  }

  @Put(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() body: UpdateBusinessDto
  ) {
    return await this.updateBusiness.execute(body, params.id);
  }
}