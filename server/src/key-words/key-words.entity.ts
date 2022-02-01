import {Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Detail} from "../details/entity/detail.entity";

@Entity()
export class KeyWords {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    keyWord: string

    @Index('key_words_shortName_index')
    @Column()
    shortName: string

    @ManyToMany(() => Detail, detail => detail.keyWords)
    detail: Detail[]

}
