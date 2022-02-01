import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user.entity";

@Entity()
export class Company {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    opf: string

    @Column()
    companyName: string

    @Column()
    inn: string

    @Column()
    kpp: string

    @Column()
    address: string

    @ManyToOne(() => User, (user: User) => user.company,
        {onDelete: "CASCADE"})
    user: User

}
