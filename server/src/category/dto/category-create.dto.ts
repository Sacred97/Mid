import {IsNotEmpty, IsString} from "class-validator";

export class CategoryCreateDto {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    categoryName: string

    @IsNotEmpty()
    @IsString()
    productGroupId: string
}
