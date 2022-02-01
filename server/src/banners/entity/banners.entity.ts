import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";

@Entity()
export class Banners {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @Exclude()
    @Column()
    key: string

    @Column()
    serialNumber: number

    @Column({default: false})
    homePage: boolean

    @Column({nullable: true})
    pageReference: string

}
