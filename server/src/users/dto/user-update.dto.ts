import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class UserUpdateDto {

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
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
