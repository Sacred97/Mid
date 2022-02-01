import {IsNotEmpty, IsString} from "class-validator";

export class CompanyCreateDto {
    @IsNotEmpty()
    @IsString()
    opf: string

    @IsNotEmpty()
    @IsString()
    companyName: string

    @IsNotEmpty()
    @IsString()
    inn: string

    @IsNotEmpty()
    @IsString()
    kpp: string

    @IsNotEmpty()
    @IsString()
    address: string
}
