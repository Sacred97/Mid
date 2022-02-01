import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class RequestHistoryUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    detailCart: string
}
