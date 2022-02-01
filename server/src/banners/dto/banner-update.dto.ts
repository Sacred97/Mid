import {IsBoolean, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class BannerUpdateDto {

    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    serialNumber?: number

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    homePage?: boolean

}
