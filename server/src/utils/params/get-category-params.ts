import {IsString} from 'class-validator';
import {Transform} from "class-transformer";

export class getCategoryParams {

    @Transform(v => decodeURI(v.obj.id))
    @IsString()
    id: string
}
