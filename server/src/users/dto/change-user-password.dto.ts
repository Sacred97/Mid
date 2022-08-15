import {IsNotEmpty, IsString} from "class-validator";

export class ChangeUserPasswordDto {

    @IsNotEmpty()
    @IsString()
    currentPassword: string

    @IsNotEmpty()
    @IsString()
    newPassword: string

}
