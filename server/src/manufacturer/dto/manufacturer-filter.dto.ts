import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class ManufacturerFilterDto {

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    region: number

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    country: number

    @IsOptional()
    @IsString()
    letter: string

}
