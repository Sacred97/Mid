import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";

@Entity()
export class AccessKeys {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number

    @Exclude()
    @Column({unique: true})
    access: string

    @Exclude()
    @Column()
    key: string
}
