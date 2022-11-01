import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class RequisitesDto {
    @IsNotEmpty()
    @IsString()
    inn: string

    @IsNotEmpty()
    @IsString()
    company: string

    @IsOptional()
    @IsString()
    kpp?: string

    @IsNotEmpty()
    @IsString()
    companyAddress: string
}
