import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Detail} from "../../details/entity/detail.entity";
import {WaitingList} from "./waiting-list.entity";

@Entity()
export class WaitingItem {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => WaitingList, waitingList => waitingList.waitingItem,
        {onDelete: "CASCADE"})
    waitingList: WaitingList

    @ManyToOne(() => Detail, detail => detail.waitingItem,
        {onDelete: "CASCADE", eager: true})
    detail: Detail

}
