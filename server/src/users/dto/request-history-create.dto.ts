import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class RequestHistoryCreateDto {
    @IsNotEmpty()
    @IsNumber()
    result: number

    @IsNotEmpty()
    @IsString()
    requestString: string
}
