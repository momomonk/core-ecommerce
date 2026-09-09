import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { typeOrmConfig } from './infrastructure/persistence/typeorm.config'; 
import { UserController } from './infrastructure/transport/http/user.controller';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { ChangeUserStatusUseCase } from './application/use-cases/change-user-status.use-case';
import { UserRepositoryImpl } from './infrastructure/persistence/repositories/user.repository.impl';
import { UserOrmEntity } from './infrastructure/persistence/entities-orm/user.orm-entity';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { BcryptService } from './infrastructure/persistence/services/bycrypt-password-hasher.services';
import { AuthApiService } from './infrastructure/persistence/services/auth-api.services';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserOrmEntity]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
          },
          ttl: 3600 * 1000,
        }),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    ListUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    ChangeUserStatusUseCase,
    BcryptService,
    AuthApiService,
    { provide: 'UserRepository', useClass: UserRepositoryImpl },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}