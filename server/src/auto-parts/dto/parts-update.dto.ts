import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class PartsUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    autoPartsName: string
}
