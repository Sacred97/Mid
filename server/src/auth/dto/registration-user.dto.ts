import { IsNotEmpty, IsString } from 'class-validator';
import {Transform} from "class-transformer";

export class RegistrationUserDto {
  @IsNotEmpty()
  @Transform(obj => obj.obj.email.toLowerCase())
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  fullName: string

  @IsNotEmpty()
  @IsString()
  phone: string
}
