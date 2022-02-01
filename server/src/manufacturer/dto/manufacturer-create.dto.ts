import {IsNotEmpty, IsString} from "class-validator";

export class ManufacturerCreateDto {
    @IsNotEmpty()
    @IsString()
    nameCompany: string

    @IsNotEmpty()
    @IsString()
    countryName: string

    @IsNotEmpty()
    @IsString()
    regionName: string
}
