import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class ProductGroupUpdateDto {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    productGroup: string
}
