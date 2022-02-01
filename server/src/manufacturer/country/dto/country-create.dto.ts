import {IsNotEmpty, IsString} from "class-validator";

export class CountryCreateDto {
    @IsNotEmpty()
    @IsString()
    country: string

    @IsNotEmpty()
    @IsString()
    regionName: string
}
