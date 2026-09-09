import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

// Rutas relativas corregidas desde src/infrastructure/persistence/repositories/
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities-orm/user.orm-entity';
import { PaginatedResult } from '../../../common/pagination';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private readonly TTL_SECONDS = 3600;

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findById(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this.cacheManager.get<Partial<UserOrmEntity>>(cacheKey);
    
    if (cachedUser) {
      return UserMapper.toDomainFromPlain(cachedUser);
    }

    const entity = await this.repo.findOneBy({ id });
    if (!entity) return null;

    const domainUser = UserMapper.toDomain(entity);
    await this.cacheManager.set(cacheKey, entity, this.TTL_SECONDS * 1000);

    return domainUser;
  }

  async findAll(page: number, limit: number): Promise<PaginatedResult<User>> {
    const cacheKey = `users:page:${page}:limit:${limit}`;
    const cachedResult = await this.cacheManager.get<PaginatedResult<User>>(cacheKey);

    if (cachedResult) {
      return {
        ...cachedResult,
        list: cachedResult.list.map(u => UserMapper.toDomainFromPlain(u)),
      };
    }

    const [entities, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const list = entities.map(e => UserMapper.toDomain(e));

    const result: PaginatedResult<User> = {
      list,
      meta: {
        totalItems: total,
        itemCount: list.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };

    await this.cacheManager.set(cacheKey, result, this.TTL_SECONDS * 1000);
    return result;
  }

  async save(user: User): Promise<User> {
    const userToSave = this.repo.create({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      cellphone: user.cellphone,
      password: user.password,
    });

    const saved = await this.repo.save(userToSave);
    await this.clearPaginatedCache();

    return UserMapper.toDomain(saved);
  }

  async update(id: string, user: User): Promise<void> {
    await this.repo.update(id, user);
    await this.invalidateUserCache(id);
  }

  async updateStatus(id: string, status: boolean): Promise<void> {
    await this.repo.update(id, { active: status });
    await this.invalidateUserCache(id);
  }

  async findByEmail(email: string): Promise<boolean> {
    return await this.repo.exists({ where: { email } });
  }

  private async invalidateUserCache(id: string): Promise<void> {
    await Promise.all([
      this.cacheManager.del(`user:${id}`),
      this.clearPaginatedCache(),
    ]);
  }

  private async clearPaginatedCache(): Promise<void> {
    // Solución para cache-manager v6+ (.stores en lugar de .store)
    const store = (this.cacheManager as any).stores?.[0];
    if (store && typeof store.keys === 'function') {
      const keys: string[] = await store.keys('users:page:*');
      await Promise.all(keys.map((key) => this.cacheManager.del(key)));
    }
  }
}