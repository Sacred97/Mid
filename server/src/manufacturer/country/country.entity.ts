import {Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Manufacturer} from "../entity/manufacturer.entity";
import {Region} from "../region/region.entity";

@Entity()
export class Country {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    country: string

    @Index('country_shortName_index')
    @Column()
    shortName: string

    @OneToMany(() => Manufacturer, manufacturer => manufacturer.country)
    manufacturer: Manufacturer[]

    @ManyToOne(() => Region, region => region.country,
        {onDelete: "CASCADE"})
    region: Region

}
