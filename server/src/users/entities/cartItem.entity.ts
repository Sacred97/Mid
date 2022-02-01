import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShoppingCart } from './shoppingCart.entity';
import { Detail } from '../../details/entity/detail.entity';
import {Exclude} from "class-transformer";

@Entity()
export class CartItem {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  quantity: number

  @Column({type: "float"})
  price: number

  @Column({type: 'float'})
  finalPrice: number

  @Column({type: "float", default: 0})
  weight: number

  @Column({type: "float", default: 0})
  finalWeight: number

  @Column({type: "timestamptz", default: () => "now()"})
  timeAdd: string

  @ManyToOne(() => ShoppingCart, (shoppingCart: ShoppingCart) => shoppingCart.cartItem,
    {onDelete: 'CASCADE'})
  shoppingCart: ShoppingCart

  @ManyToOne(() => Detail, detail => detail.cartItem,
    {onDelete: 'CASCADE', eager: true})
  detail: Detail

}
