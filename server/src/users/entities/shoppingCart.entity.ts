import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user.entity';
import { CartItem } from './cartItem.entity';

@Entity()
export class ShoppingCart {

  @PrimaryGeneratedColumn()
  id: number

  @Column({default: 0, type: 'float'})
  totalCost: number

  @Column({default: 0, type: "float"})
  totalWeight: number

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.shoppingCart,
      {eager: true})
  cartItem: CartItem[]

  @OneToOne(() => User, (user: User) => user.shoppingCart)
  user: User
}
