import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class DetailPatchDto {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsOptional()
    @IsNotEmpty()
    @Type(()=> Number)
    @IsNumber()
    price?: number

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    storageGES?: number

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    storageOrlovka?: number

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    storageGarage2000?: number
}
