import { IsString, IsNotEmpty, IsObject} from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsObject()
  @IsNotEmpty()
  themeConfig: Record<string, any>;

  @IsObject()
  @IsNotEmpty()
  domainSettings: Record<string, any>;
}