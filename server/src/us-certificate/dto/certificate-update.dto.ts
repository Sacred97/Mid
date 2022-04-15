import {IsNotEmpty, IsNumber} from "class-validator";

export class CertificateUpdateDto {

    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsNumber()
    serialNumber: number

}
