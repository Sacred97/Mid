import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Manager } from './entities/manager.entity';
import { ShoppingCart } from './entities/shoppingCart.entity';
import { Order } from './entities/order.entity';
import {Company} from "./entities/company.entity";
import {Address} from "./entities/address.entity";
import {Subscriptions} from "./entities/subscriptions.entity";
import {RequestHistory} from "./entities/request-history.entity";
import {WaitingList} from "./entities/waiting-list.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  email: string

  @Column()
  @Exclude()
  password: string

  @Column()
  fullName: string

  @Column()
  phone: string

  @Column({nullable: true})
  additionalPhone: string

  @Column({default: false})
  @Exclude()
  isAdmin: boolean

  @Column({default: false})
  @Exclude()
  emailVerified: boolean

  @Column({nullable: true})
  @Exclude()
  currentHashedRefreshToken?: string

  @Column({nullable: true})
  @Exclude()
  restorePasswordToken?: string

  @Column({type: "timestamptz", default: () => 'NOW()'})
  @Exclude()
  dateOfCreateAccount: string

  @JoinColumn()
  @OneToOne(() => WaitingList, (waitingList:WaitingList) => waitingList.user,
      {cascade: true})
  waitingList: WaitingList

  @JoinColumn()
  @OneToOne(() => ShoppingCart, (shoppingCart: ShoppingCart) => shoppingCart.user,
      {cascade: true})
  shoppingCart: ShoppingCart

  @OneToMany(() => RequestHistory, (requestHistory: RequestHistory) => requestHistory.user)
  requestHistory: RequestHistory[]

  @OneToMany(() => Manager, (manager: Manager) => manager.user)
  manager: Manager[]

  @OneToMany(() => Company, (company: Company) => company.user)
  company: Company[]

  @OneToMany(() => Address, (address: Address) => address.user)
  address: Address[]

  @OneToMany(() => Subscriptions, (subscriptions: Subscriptions) => subscriptions.user)
  subscriptions: Subscriptions[]

  @OneToMany(() => Order, order => order.user)
  order: Order[]
}
