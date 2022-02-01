import {IsNumber, IsOptional, Min} from "class-validator";
import {Type} from "class-transformer";

export class TakeSkipParams {

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
