import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {DetailIdDto} from "../../shared-dto/detail-id.dto";

export class KeyWordsUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    keyWord?: string

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => DetailIdDto)
    detail?: DetailIdDto[]
}
