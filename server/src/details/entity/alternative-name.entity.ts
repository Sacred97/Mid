import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Detail} from "./detail.entity";

@Entity()
export class AlternativeName {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    alternativeName: string

    @Column()
    shortName: string

    @ManyToOne(() => Detail, detail => detail.alternativeName,
        {onDelete: "CASCADE"})
    detail: Detail

}
