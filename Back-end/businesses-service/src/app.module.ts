import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './infrastructure/persistence/typeorm.config'; 
import { BusinessController } from './infrastructure/transport/http/business.controller';
import { BusinessSettingsController } from './infrastructure/transport/http/business-settings.controller';
import { ListBusinessesUseCase } from './application/use-cases/list-businesses.use-case';
import { CreateBusinessUseCase } from './application/use-cases/create-business.use-case';
import { UpdateBusinessUseCase } from './application/use-cases/update-business.use-case';
import { ChangeBusinessStatusUseCase } from './application/use-cases/change-business-status.use-case';
import { ChangeBusinessNameUseCase } from './application/use-cases/change-business-name.use-case';
import { ListBusinessSettingsUseCase } from './application/use-cases/list-business-settings.use-case';
import { CreateBusinessSettingsUseCase } from './application/use-cases/create-business-settings.use-case';
import { UpdateBusinessSettingsUseCase } from './application/use-cases/update-business-settings.use-case';
import { BusinessRepositoryImpl } from './infrastructure/persistence/repositories/business.repository.impl';
import { BusinessSettingsRepositoryImpl } from './infrastructure/persistence/repositories/business-settings.repository.impl';
import { BusinessOrmEntity } from './infrastructure/persistence/entities-orm/business.orm-entity';
import { BusinessSettingsOrmEntity } from './infrastructure/persistence/entities-orm/business-settings.orm-entity';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ChangeBusinessSettingsThemeConfigUseCase } from './application/use-cases/change-business-settings-theme-config.use-case';
import { ChangeBusinessSettingsDomainSettingsUseCase } from './application/use-cases/change-business-settings-domain-settings.use-case';
import { ChangeBusinessSlugUseCase } from './application/use-cases/change-business-slug.use-case';
import { GetBusinessUseCase } from './application/use-cases/get-business.use-case';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([BusinessOrmEntity, BusinessSettingsOrmEntity]),
  ],
  controllers: [BusinessController, BusinessSettingsController],
  providers: [
    ListBusinessesUseCase,
    CreateBusinessUseCase,
    GetBusinessUseCase,
    UpdateBusinessUseCase,
    ChangeBusinessNameUseCase,
    ChangeBusinessStatusUseCase,
    ChangeBusinessSlugUseCase,
    { provide: 'BusinessRepository', useClass: BusinessRepositoryImpl },
    ListBusinessSettingsUseCase,
    CreateBusinessSettingsUseCase,
    UpdateBusinessSettingsUseCase,
    ChangeBusinessSettingsDomainSettingsUseCase,
    ChangeBusinessSettingsThemeConfigUseCase,
    { provide: 'BusinessSettingsRepository', useClass: BusinessSettingsRepositoryImpl },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); 
  }
}