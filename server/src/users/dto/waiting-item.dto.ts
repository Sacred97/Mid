import {IsNotEmpty, IsString} from "class-validator";
import {Entity} from "typeorm";

@Entity()
export class WaitingItemDto {
    @IsNotEmpty()
    @IsString()
    detailId: string
}
