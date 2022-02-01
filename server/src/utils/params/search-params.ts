import {IsNotEmpty, IsNumber, IsOptional, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class SearchParams {

    @IsNotEmpty()
    @IsString()
    search: string

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset?: number

}
