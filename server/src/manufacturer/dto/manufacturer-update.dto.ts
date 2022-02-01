import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class ManufacturerUpdateDto {

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    nameCompany?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    countryId?: number

}
