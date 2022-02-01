import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class AdditionalCodeUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    additionalCode?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    detailId?: string
}
