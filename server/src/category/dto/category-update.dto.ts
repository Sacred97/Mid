import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CategoryUpdateDto {

    @IsNotEmpty()
    @IsString()
    id: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    categoryName: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    productGroupId: string

}
