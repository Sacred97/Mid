import {IsNotEmpty, IsString} from 'class-validator';

export class PartsCreateDto {
  @IsNotEmpty()
  @IsString()
  autoPartsName: string
}
