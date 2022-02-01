import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';


export class DetailCreateDto {

  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  productCode: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  vendorCode: string

  @IsOptional()
  @Type(()=> Number)
  @IsNumber()
  price: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storageGES: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storageOrlovka: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  storageGarage2000:number

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  unit: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight: number

  @IsOptional()
  @IsBoolean()
  isSale: boolean

  @IsOptional()
  @IsString()
  saleText: string

  @IsOptional()
  @IsBoolean()
  isPopular: boolean

  @IsOptional()
  @IsString()
  popularText: string

  @IsOptional()
  @IsString()
  manufacturerName: string

  @IsOptional()
  @IsString()
  country: string

  @IsOptional()
  @IsString()
  region: string

  @IsOptional()
  @IsString()
  productGroupId: string

  @IsOptional()
  @IsString()
  productGroupName: string

  @IsOptional()
  @IsString()
  categoryName: string

  @IsNotEmpty()
  @IsString()
  categoryId: string

  @IsOptional()
  @IsString()
  autoPartsString: string

  @IsOptional()
  @IsString()
  autoApplicabilityString: string

  @IsOptional()
  @IsString()
  additionalVendorCodeString: string

  @IsOptional()
  @IsString()
  alternativeNameString: string

  @IsOptional()
  @IsString()
  keyWordsString: string

}
