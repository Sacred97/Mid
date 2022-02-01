import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class SubscriptionsCreateDto {
    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsNumber()
    newsLetterId: number

    @IsOptional()
    @IsString()
    notice?: string
}
