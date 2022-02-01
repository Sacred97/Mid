import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class DetailPhotoUpdateDto {

    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    detailId: string

}
