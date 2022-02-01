import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    ValidateIf,
    ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {GuestRecountOrder} from "./guest-recount-order.dto";
import {RequisitesDto} from "../../shared-dto/requisites.dto";

export class GuestMakeOrderDto {

    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(() => GuestRecountOrder)
    order: GuestRecountOrder[]

    @IsNotEmpty()
    @IsString()
    fullName: string

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    phone: string

    @IsOptional()
    @IsNotEmpty()
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
