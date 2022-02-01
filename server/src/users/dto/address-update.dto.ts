import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class AddressUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    deliveryMethod?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    deliveryAddress?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    transportCompany?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    addressName?: string

    @IsOptional()
    @IsBoolean()
    isMain?: boolean

}
