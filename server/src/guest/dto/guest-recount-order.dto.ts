import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class GuestRecountOrder {

    @IsNotEmpty()
    @IsString()
    detailId: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number

}
