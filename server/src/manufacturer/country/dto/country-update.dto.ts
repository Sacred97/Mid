import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CountryUpdateDto {

    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    country?: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    regionId?: number

}
