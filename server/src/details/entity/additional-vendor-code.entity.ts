import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Detail} from "./detail.entity";

@Entity()
export class AdditionalVendorCode {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    additionalCode: string

    @Column()
    shortName: string

    @ManyToOne(() => Detail, detail => detail.additionalVendorCode,
        {onDelete: "CASCADE"})
    detail: Detail


}
