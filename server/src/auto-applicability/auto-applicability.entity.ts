import {Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Detail } from '../details/entity/detail.entity';

@Entity()
export class AutoApplicability {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  autoApplicabilityName: string

  @Index('auto_applicability_shortName_index')
  @Column()
  shortName: string

  @ManyToMany(() => Detail, (detail: Detail) => detail.autoApplicability)
  details: Detail[]

}
