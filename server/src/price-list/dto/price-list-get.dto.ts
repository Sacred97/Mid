import {ArrayMinSize, ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class PriceListGetDto {

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    list: string[]

}
