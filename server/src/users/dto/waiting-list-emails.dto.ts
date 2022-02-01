import {IsNotEmpty, IsString} from "class-validator";

export class WaitingListEmailsDto {

    @IsNotEmpty()
    @IsString()
    emails: string

}
