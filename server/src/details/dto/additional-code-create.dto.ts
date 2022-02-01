import {IsNotEmpty, IsString} from "class-validator";

export class AdditionalCodeCreateDto {
    @IsNotEmpty()
    @IsString()
    additionalCode: string

    @IsNotEmpty()
    @IsString()
    detailId: string

}
