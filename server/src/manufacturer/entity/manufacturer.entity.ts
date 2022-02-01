import {Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Detail } from '../../details/entity/detail.entity';
import { PhotoCertificate } from './photoCertificate.entity';
import {Country} from "../country/country.entity";
import {Exclude} from "class-transformer";

@Entity()
export class Manufacturer {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nameCompany: string

  @Index('manufacturer_shortName_index')
  @Column({unique: true})
  shortName: string

  @Column({nullable: true, type: 'text'})
  description: string

  @Column({nullable: true})
  logoCompanyUrl: string

  @Exclude()
  @Column({nullable: true})
  logoCompanyKey: string

  @OneToMany(() => PhotoCertificate,photoCertificate => photoCertificate.manufacturer,
      {eager: true})
  photoCertificate: PhotoCertificate[]

  @OneToMany(() => Detail, detail => detail.manufacturer)
  detail: Detail[]

  @ManyToOne(() => Country, country => country.manufacturer,
      {onDelete: "SET NULL"})
  country: Country
}
