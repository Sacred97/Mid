import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class ApplicabilityUpdateDto {

    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmpty()
    @IsString()
    autoApplicabilityName: string

}
