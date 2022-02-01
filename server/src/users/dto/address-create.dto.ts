import {IsBoolean, IsNotEmpty, IsString, ValidateIf} from "class-validator";

export class AddressCreateDto {
    @IsNotEmpty()
    @IsString()
    deliveryMethod: string

    @IsNotEmpty()
    @IsString()
    deliveryAddress: string

    @IsNotEmpty()
    @IsString()
    addressName: string

    @IsNotEmpty()
    @IsBoolean()
    isMain: boolean

    @ValidateIf(o => o.deliveryMethod !== 'Самовывоз')
    @IsNotEmpty()
    @IsString()
    transportCompany?: string

}
