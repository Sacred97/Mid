import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CompanyUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    opf?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    companyName?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    inn?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    kpp?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address?: string
}
