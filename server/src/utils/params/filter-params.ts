import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class FilterParams {

  @IsNotEmpty()
  @IsString()
  sort: string

  @IsNotEmpty()
  @IsString()
  order: "ASC" | "DESC"

  @IsNotEmpty()
  @Transform(v => JSON.parse(v.obj.availability))
  @Type(() => Boolean)
  @IsBoolean()
  availability: boolean

  @IsNotEmpty()
  @Transform(v => JSON.parse(v.obj.recent))
  @Type(() => Boolean)
  @IsBoolean()
  recent: boolean

  @IsNotEmpty()
  @Transform(v => JSON.parse(v.obj.sale))
  @Type(() => Boolean)
  @IsBoolean()
  sale: boolean

  @IsNotEmpty()
  @Transform(v => JSON.parse(v.obj.popular))
  @Type(() => Boolean)
  @IsBoolean()
  popular: boolean

  @IsOptional()
  @IsString()
  letter?: string

  @IsOptional()
  @IsString()
  word?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number

}
