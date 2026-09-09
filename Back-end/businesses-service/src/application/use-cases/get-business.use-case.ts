import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { BusinessSettingsRepository } from '../../domain/repositories/business-settings.repository';
import { BusinessRepository } from '../../domain/repositories/business.repository';
import { Business } from '../../domain/entities/business.entity';
import { CreateBusinessDto } from '../../infrastructure/transport/http/dto/create-business.dto';
import { ErrorMessages } from '../../common/constants/error-messages';
import { BusinessSettings } from 'src/domain/entities/business-settings.entity';

@Injectable()
export class GetBusinessUseCase {
  constructor(
    @Inject('BusinessRepository') private readonly repo: BusinessRepository,
    @Inject('BusinessSettingsRepository') private readonly settingsRepo: BusinessSettingsRepository
  ) {}

  async execute(id: string) {
    const businessAvailable = await this.repo.findById(id);
    if(!businessAvailable) throw new BadRequestException(ErrorMessages.ID_EXISTS);
    const businessSettings = await this.settingsRepo.findById(id);
    return { business: businessAvailable, settings: businessSettings };
  }
}