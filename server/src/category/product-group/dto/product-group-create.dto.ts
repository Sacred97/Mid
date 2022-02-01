import {IsNotEmpty, IsString} from "class-validator";

export class ProductGroupCreateDto {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    productGroup: string
}
