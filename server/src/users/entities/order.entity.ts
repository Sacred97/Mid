import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user.entity';
import { OrderItem } from './orderItem.entity';
import {Exclude} from "class-transformer";

@Entity()
export class Order{

  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'timestamptz', default: () => `NOW()`})
  orderDate: string

  @Column({unique: true})
  orderNumber: string

  @Column({type: "float"})
  orderCost: number

  @Column({type: "float"})
  orderWeight: number

  @Column()
  contactFullName: string

  @Column()
  contactEmail: string

  @Column()
  contactPhone: string

  @Column({nullable: true})
  contactAdditionalPhone: string

  @Column()
  customer: string

  @Column({nullable: true})
  company: string

  @Column({nullable: true})
  inn: string

  @Column({nullable: true})
  kpp: string

  @Column({nullable: true})
  companyAddress: string

  @Column()
  paymentMethod: string

  @Column()
  deliveryMethod: string

  @Column()
  deliveryAddress: string

  @Column({default: false})
  @Exclude()
  isSendToOneC: boolean

  @Column({default: false})
  @Exclude()
  isSendToMailCustomer: boolean

  @Column({default: false})
  @Exclude()
  isSendToMailMidkam: boolean

  @OneToMany(() => OrderItem, orderItem => orderItem.order, {eager: true})
  orderItem: OrderItem[]

  @ManyToOne(() => User, user => user.order,
      {onDelete: "CASCADE"})
  user: User
}
