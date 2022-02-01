import {IsNotEmpty, IsString} from "class-validator";

export class VerificationRestoreDto {

    @IsNotEmpty()
    @IsString()
    email:string

}
