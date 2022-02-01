import {IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested} from 'class-validator';
import {Type} from "class-transformer";
import {DetailIdDto} from "../../shared-dto/detail-id.dto";

export class ApplicabilityCreateDto {

  @IsNotEmpty()
  @IsString()
  autoApplicabilityName: string

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({each: true})
  // @Type(() => DetailIdDto)
  // details?: DetailIdDto[]

}

