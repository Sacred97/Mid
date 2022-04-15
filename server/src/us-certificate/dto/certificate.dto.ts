import {IsNumber, IsOptional} from "class-validator";

export class CertificateDto {
    @IsOptional()
    @IsNumber()
    serialNumber: number
}
