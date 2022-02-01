import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class PhotoCertificateDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    manufacturerId: number
}
