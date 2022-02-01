import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class ManagerCreateDto {
  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  fullName: string

  @IsNotEmpty()
  @IsString()
  phone: string

  @IsOptional()
  @IsString()
  additionalPhone?: string
}
