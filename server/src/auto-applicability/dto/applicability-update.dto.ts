import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {DetailIdDto} from "../../shared-dto/detail-id.dto";

export class ApplicabilityUpdateDto {

    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    autoApplicabilityName?: string

}
