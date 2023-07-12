import {IsBoolean, IsNotEmpty, IsNumber} from "class-validator";
import {Transform, Type} from "class-transformer";

export class PhotoCertificateDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    manufacturerId: number

    @IsNotEmpty()
    @IsBoolean()
    lowResolution: boolean

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    relations: number

}
