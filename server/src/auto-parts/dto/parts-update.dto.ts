import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class PartsUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    autoPartsName?: string
}
