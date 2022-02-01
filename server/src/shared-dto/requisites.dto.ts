import {IsNotEmpty, IsString} from "class-validator";

export class RequisitesDto {
    @IsNotEmpty()
    @IsString()
    inn: string

    @IsNotEmpty()
    @IsString()
    company: string

    @IsNotEmpty()
    @IsString()
    kpp: string

    @IsNotEmpty()
    @IsString()
    companyAddress: string
}
