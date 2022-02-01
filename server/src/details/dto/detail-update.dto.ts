import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import {ManyToManyIdsDto} from "../../shared-dto/many-to-many-ids.dto";

export class DetailUpdateDto {

  @IsNotEmpty()
  @IsString()
  id: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productCode?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  vendorCode?: string

  @IsOptional()
  @IsNotEmpty()
  @Type(()=> Number)
  @IsNumber()
  price?: number

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  storageGES?: number

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  storageOrlovka?: number

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  storageGarage2000?: number

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  unit?: string

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isSale?: boolean

  @IsOptional()
  @IsString()
  saleText?: string

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isPopular?: boolean

  @IsOptional()
  @IsString()
  popularText?: string

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isHide?: boolean

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isNewDetail?: boolean

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  manufacturerId?: number

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ManyToManyIdsDto)
  autoParts?: ManyToManyIdsDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ManyToManyIdsDto)
  autoApplicability?: ManyToManyIdsDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ManyToManyIdsDto)
  keyWords?: ManyToManyIdsDto[]
}

