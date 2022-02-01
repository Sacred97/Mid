import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Detail } from './detail.entity';
import {Exclude} from "class-transformer";

@Entity()
export class PhotoDetail {
  @PrimaryGeneratedColumn()
  id: number

  @Exclude()
  @Column()
  key: string

  @Column()
  url: string

  @Column({default: false})
  isMain: boolean

  @ManyToOne(() => Detail, detail => detail.photoDetail,
    {onDelete: 'CASCADE'})
  detail: Detail

}
