import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import {Type} from "class-transformer";
import {RequisitesDto} from "../../shared-dto/requisites.dto";

export class OrderCreateDto {

  @IsNotEmpty()
  @IsString()
  fullName: string

  @IsNotEmpty()
  @IsString()
  phone: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  additionalPhone?: string

  @IsNotEmpty()
  @IsString()
  customer: string

  @ValidateIf(o => o.customer === 'Юр.лицо')
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({each: true})
  @Type(() => RequisitesDto)
  requisites?: RequisitesDto

  @IsNotEmpty()
  @IsString()
  payment: string

  @IsNotEmpty()
  @IsString()
  delivery: string

  @IsNotEmpty()
  @IsString()
  address: string
}
