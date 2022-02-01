import {IsNotEmpty, IsString} from "class-validator";

export class AccessDto {
    @IsNotEmpty()
    @IsString()
    access: string

    @IsNotEmpty()
    @IsString()
    key: string
}
