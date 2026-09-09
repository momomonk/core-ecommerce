// infrastructure/persistence/mappers/user.mapper.ts
import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities-orm/user.orm-entity';

export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): User {
    return new User({
      id: ormEntity.id,
      first_name: ormEntity.first_name,
      last_name: ormEntity.last_name,
      email: ormEntity.email,
      cellphone: ormEntity.cellphone,
      active: ormEntity.active,
    });
  }

  static toDomainFromPlain(plain: Partial<UserOrmEntity>): User {
    return new User({
      id: plain.id,
      first_name: plain.first_name,
      last_name: plain.last_name,
      email: plain.email,
      cellphone: plain.cellphone,
      active: plain.active,
    });
  }
}