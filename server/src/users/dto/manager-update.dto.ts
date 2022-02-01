import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class ManagerUpdateDto {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  email?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  additionalPhone?: string
}
