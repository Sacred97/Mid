import {IsNotEmpty, IsNumber, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class GetDetailParams {

    @IsNotEmpty()
    @IsString()
    sortBy: 'name' | 'price'

    @IsNotEmpty()
    @IsString()
    orderBy: "ASC" | "DESC"

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset: number

}
