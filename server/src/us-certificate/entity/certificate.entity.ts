import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";

@Entity()
export class Certificate {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @Exclude()
    @Column()
    key: string

    @Column()
    serialNumber: number

}
