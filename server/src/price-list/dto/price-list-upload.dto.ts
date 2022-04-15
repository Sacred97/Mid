import {IsNotEmpty, IsString} from "class-validator";

export class PriceListUploadDto {

    @IsNotEmpty()
    @IsString()
    fileName: string

    @IsNotEmpty()
    @IsString()
    file: string

}
