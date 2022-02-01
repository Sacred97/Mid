import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Country} from "../country/country.entity";

@Entity()
export class Region {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    region: string

    @Index('region_shortName_index')
    @Column()
    shortName: string

    @OneToMany(() => Country, country => country.region)
    country: Country[]

}
