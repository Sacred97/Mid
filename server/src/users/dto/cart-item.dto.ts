import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartItemDto {
  @IsNotEmpty()
  @IsString()
  detailId: string

  @IsNotEmpty()
  @IsNumber()
  quantity: number
}
