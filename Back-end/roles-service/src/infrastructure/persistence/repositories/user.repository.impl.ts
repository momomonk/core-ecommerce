import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities-orm/user.orm-entity';
import { PaginatedResult } from '../../../common/pagination';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@InjectRepository(UserOrmEntity) private repo: Repository<UserOrmEntity>) {}

  async findAll(page: number, limit: number): Promise<PaginatedResult<User>> {
    const [entities, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const list = entities.map(e => new User({
      id: e.id,
      first_name: e.first_name,
      last_name: e.last_name,
      email: e.email,
      cellphone: e.cellphone,
      active: e.active,
    }));
  
    return {
      list,
      meta: {
        totalItems: total,
        itemCount: list.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }
    };
  }

  async save(user: User): Promise<User> {
    const userToSave = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      cellphone: user.cellphone,
      password: user.password
    };
  
    const entity = this.repo.create(userToSave);
    
    const saved = await this.repo.save(entity);
    
    return new User({
      id: saved.id,
      first_name: saved.first_name,
      last_name: saved.last_name,
      email: saved.email,
      cellphone: saved.cellphone,
      active: saved.active
    });
  }

  async findById(id: string): Promise<User | null> {
    const e = await this.repo.findOneBy({ id });
    return e ? new User({
      id: e.id,
      first_name: e.first_name,
      last_name: e.last_name,
      email: e.email,
      cellphone: e.cellphone,
      active: e.active
    }) : null;
  }

  async updateStatus(id: string, status: boolean): Promise<void> {
    await this.repo.update(id, { active: status });
  }

  async update(id: string, user: User): Promise<void> {
    await this.repo.update(id, user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const find = await this.repo.findOneBy({
        email   
    });
    return find ? new User({
      id: find.id,
      first_name: find.first_name,
      last_name: find.last_name,
      email: find.email,
      password: find.password,
    }) : null;
  }
}