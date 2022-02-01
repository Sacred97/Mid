import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user.entity";

@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    deliveryMethod: string

    @Column()
    deliveryAddress: string

    @Column({nullable: true})
    transportCompany: string

    @Column()
    addressName: string

    @Column({default: false})
    isMain: boolean

    @ManyToOne(() => User, (user: User) => user.address,
        {onDelete: "CASCADE"})
    user: User

}
