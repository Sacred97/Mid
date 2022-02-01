import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class NewsLetterUpdateDto {

    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    name: string

}
