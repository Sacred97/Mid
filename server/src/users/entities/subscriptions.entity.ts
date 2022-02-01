import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {NewsLetter} from "../../news-letter/entity/news-letter.entity";
import {User} from "../user.entity";

@Entity()
export class Subscriptions {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({nullable: true})
    notice: string

    @ManyToOne(() => User, (user: User) => user.subscriptions,
        {onDelete: "CASCADE"})
    user: User

    @ManyToOne(() => NewsLetter, (newsLetter: NewsLetter) => newsLetter.subscriptions,
        {onDelete: "CASCADE", eager: true})
    newsLetter: NewsLetter

}
