import {IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class CertificateDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    serialNumber: number
}
