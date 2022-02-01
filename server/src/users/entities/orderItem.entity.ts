import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  productName: string

  @Column()
  vendorCode: string

  @Column({nullable: true})
  manufacturer: string

  @Column({type: "float"})
  price: number

  @Column()
  quantity: number

  @Column({type: "float"})
  totalCost: number

  @Column({type: "float"})
  totalWeight: number

  @Column()
  detailId: string

  @ManyToOne(() => Order, order => order.orderItem,
      {onDelete: 'CASCADE'})
  order: Order
}
