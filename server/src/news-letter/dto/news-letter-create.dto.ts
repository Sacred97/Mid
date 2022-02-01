import {IsNotEmpty, IsString} from "class-validator";

export class NewsLetterCreateDto {

    @IsNotEmpty()
    @IsString()
    name: string

}
