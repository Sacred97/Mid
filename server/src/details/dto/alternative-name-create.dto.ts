import {IsNotEmpty,IsString} from "class-validator";

export class AlternativeNameCreateDto {
    @IsNotEmpty()
    @IsString()
    alternativeName: string

    @IsNotEmpty()
    @IsString()
    detailId: string
}
