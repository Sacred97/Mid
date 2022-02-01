import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class AlternativeNameUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    alternativeName?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    detailId?: string
}
