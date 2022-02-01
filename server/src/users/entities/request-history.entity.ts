import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user.entity";

@Entity()
export class RequestHistory {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "timestamptz", default: () => 'NOW()'})
    requestDate: string

    @Column()
    result: number

    @Column()
    requestString: string

    @Column({nullable: true})
    detailCart: string

    @ManyToOne(() => User, (user: User) => user.requestHistory,
        {onDelete: "CASCADE"})
    user: User

}
