import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class RegionUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    region: string
}
