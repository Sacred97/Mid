import {IsNotEmpty, IsString} from 'class-validator';

export class ApplicabilityCreateDto {

  @IsNotEmpty()
  @IsString()
  autoApplicabilityName: string

}

