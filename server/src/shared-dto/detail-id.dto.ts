import {IsNotEmpty, IsString} from "class-validator";

export class DetailIdDto {
    @IsNotEmpty()
    @IsString()
    id: string
}
