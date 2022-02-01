import {IsNotEmpty, IsNumber, IsOptional, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class SearchUserParams {

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    offset: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    email: string

}
