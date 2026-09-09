import { Injectable, Inject } from '@nestjs/common';
import { BusinessSettingsRepository } from '../../domain/repositories/business-settings.repository';


@Injectable()
export class ListBusinessSettingsUseCase {
  constructor(@Inject('BusinessSettingsRepository') private readonly repo: BusinessSettingsRepository) {}

  async execute(page: number, limit: number) {
    return await this.repo.findAll(page, limit);
  }
}