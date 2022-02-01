import {IsNotEmpty, IsString} from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    token: string

    @IsNotEmpty()
    @IsString()
    password: string
}
