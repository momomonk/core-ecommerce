import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { BusinessSettingsRepository } from '../../domain/repositories/business-settings.repository';
import { BusinessRepository } from '../../domain/repositories/business.repository';
import { Business } from '../../domain/entities/business.entity';
import { CreateBusinessDto } from '../../infrastructure/transport/http/dto/create-business.dto';
import { ErrorMessages } from '../../common/constants/error-messages';
import { BusinessSettings } from 'src/domain/entities/business-settings.entity';

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    @Inject('BusinessRepository') private readonly repo: BusinessRepository,
    @Inject('BusinessSettingsRepository') private readonly settingsRepo: BusinessSettingsRepository
  ) {}

  async execute(dto: CreateBusinessDto) {
    const businessAvailable = await this.repo.findBySlug(dto.slug);
    if(businessAvailable) throw new BadRequestException(ErrorMessages.SLUG_EXISTS);
    const newBusiness = new Business({
      name: dto.name,
      slug: dto.slug,
    });
    const savedBusiness = await this.repo.save(newBusiness);
    const newBusinessSettings = new BusinessSettings({
      businessSettingsId: savedBusiness.id,
      themeConfig: dto.themeConfig,
      domainSettings: dto.domainSettings,
    });
    const savedBusinessSettings = await this.settingsRepo.save(newBusinessSettings);
    return { business: savedBusiness, settings: savedBusinessSettings };
  }
}