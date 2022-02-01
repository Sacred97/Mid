import {IsNotEmpty, IsString} from "class-validator";

export class RegionCreateDto {
    @IsNotEmpty()
    @IsString()
    region: string
}
