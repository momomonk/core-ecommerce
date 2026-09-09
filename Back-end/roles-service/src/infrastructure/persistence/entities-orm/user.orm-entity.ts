import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() first_name: string;
  @Column() last_name: string;
  @Column() email: string;
  @Column() password: string;
  @Column() cellphone: string;
  @Column({ default: true }) active: boolean;
}