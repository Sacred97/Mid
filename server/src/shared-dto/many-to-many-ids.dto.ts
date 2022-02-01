import {IsNotEmpty, IsNumber} from "class-validator";

export class ManyToManyIdsDto {

    @IsNotEmpty()
    @IsNumber()
    id: number

}
