import {IsBoolean, IsNotEmpty, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";

export class DetailPhotoCreateDto {

    @IsNotEmpty()
    @Transform(v => JSON.parse(v.obj.isMain))
    @Type(() => Boolean)
    @IsBoolean()
    isMain: boolean

    @IsNotEmpty()
    @IsString()
    detailId: string

}
