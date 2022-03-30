import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";

export class BannerCreateDto {

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    serialNumber: number

    @IsNotEmpty()
    @Transform(v => JSON.parse(v.obj.homePage))
    @IsBoolean()
    homePage: boolean

    @IsOptional()
    @IsString()
    pageReference?: string

}
