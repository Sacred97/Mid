import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user.entity";
import {WaitingItem} from "./waiting-item.entity";

@Entity()
export class WaitingList {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    emails: string

    @OneToOne(() => User, (user: User) => user.waitingList)
    user: User

    @OneToMany(() => WaitingItem, waitingItem => waitingItem.waitingList, {eager: true})
    waitingItem: WaitingItem[]

}
