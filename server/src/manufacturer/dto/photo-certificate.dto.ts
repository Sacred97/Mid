import {IsBoolean, IsNotEmpty, IsNumber} from "class-validator";
import {Transform, Type} from "class-transformer";

export class PhotoCertificateDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    manufacturerId: number

    @IsNotEmpty()
    @Transform(v => JSON.parse(v.obj.lowResolution))
    @Type(() => Boolean)
    @IsBoolean()
    lowResolution: boolean

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    relations: number

}
