import {IsNotEmpty, IsString} from 'class-validator';

export class FilterDto {

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  value: string | number

}
