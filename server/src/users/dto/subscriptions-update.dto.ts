import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class SubscriptionsUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    email?: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    newsLetterId?: number

    @IsOptional()
    @IsString()
    notice?: string
}
