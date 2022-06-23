import {IsNotEmpty, IsString} from "class-validator";

export class ProductGroupDto {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    productGroup: string
}
