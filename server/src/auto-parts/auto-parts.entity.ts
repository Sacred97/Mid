import {Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Detail } from '../details/entity/detail.entity';

@Entity()
export class AutoParts {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  autoPartsName: string

  @Index('auto_parts_shortName_index')
  @Column()
  shortName: string

  @ManyToMany(() => Detail, (detail: Detail) => detail.autoParts)
  details: Detail[]

}
