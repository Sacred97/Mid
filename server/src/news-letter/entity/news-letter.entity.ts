import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Subscriptions} from "../../users/entities/subscriptions.entity";

@Entity()
export class NewsLetter {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Subscriptions, (subscriptions: Subscriptions) => subscriptions.newsLetter)
    subscriptions: Subscriptions[]

}
