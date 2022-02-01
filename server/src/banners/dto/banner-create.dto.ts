import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class BannerCreateDto {

    @IsNotEmpty()
    @IsNumber()
    serialNumber: number

    @IsNotEmpty()
    @IsBoolean()
    homePage: boolean

    @IsOptional()
    @IsString()
    pageReference?: string

}
