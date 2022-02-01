import {IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf} from "class-validator";

export class PriceListSendDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    text?: string

    @IsOptional()
    @IsString()
    comment?: string

    @ValidateIf(o => typeof o.email == "undefined" || typeof o.phone !== "undefined")
    @IsNotEmpty()
    @IsString()
    phone?: string

    @ValidateIf(o => typeof o.phone == "undefined" || typeof o.email !== "undefined")
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email?: string

}
