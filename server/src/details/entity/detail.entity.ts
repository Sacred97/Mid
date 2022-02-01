import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { PhotoDetail } from './photoDetail.entity';
import { Manufacturer } from '../../manufacturer/entity/manufacturer.entity';
import { Category } from '../../category/category.entity';
import { CartItem } from '../../users/entities/cartItem.entity';
import { AutoParts } from '../../auto-parts/auto-parts.entity';
import { AutoApplicability } from '../../auto-applicability/auto-applicability.entity';
import { Exclude } from 'class-transformer';
import {AdditionalVendorCode} from "./additional-vendor-code.entity";
import {AlternativeName} from "./alternative-name.entity";
import {KeyWords} from "../../key-words/key-words.entity";
import {WaitingItem} from "../../users/entities/waiting-item.entity";

@Entity()
export class Detail {

  @PrimaryColumn()
  id: string

  @Column()
  productCode: string

  @Index('detail_name_index')
  @Column()
  name: string

  @Index('detail_vendorCode_index')
  @Column({default: '-'})
  vendorCode: string

  @Column({default: 1000000.00, type: 'float'})
  price: number

  @Column({default: -10})
  storageGES: number

  @Column({default: -10})
  storageOrlovka: number

  @Column({default: -10})
  storageGarage2000: number

  @Column({nullable: true, type: 'text'})
  description: string

  @Column({nullable: true})
  unit: string

  @Column({default: 0, type: 'float'})
  weight: number

  @Column({default: false})
  isNewDetail: boolean

  @Column({default: false})
  isSale: boolean

  @Column({nullable: true, type: "text"})
  saleText: string

  @Column({default: false})
  isPopular: boolean

  @Column({nullable: true, type: "text"})
  popularText: string

  @Column({default: false})
  isHide: boolean

  @OneToMany(() => AdditionalVendorCode, additionalVendorCode => additionalVendorCode.detail,
      {eager: true})
  additionalVendorCode: AdditionalVendorCode[]

  @OneToMany(() => AlternativeName, alternativeName => alternativeName.detail,
      {eager: true})
  alternativeName: AlternativeName[]

  @OneToMany(() => PhotoDetail, photoDetail => photoDetail.detail,
      {eager: true})
  photoDetail: PhotoDetail[]

  @ManyToOne(() => Manufacturer, manufacturer => manufacturer.detail,
    {eager: true, onDelete: "SET NULL"})
  manufacturer: Manufacturer

  @ManyToOne(() => Category, category => category.detail,
    {onDelete: 'CASCADE'})
  category: Category

  @ManyToMany(() => AutoParts, autoPart => autoPart.details,
      {cascade: true})
  @JoinTable()
  autoParts: AutoParts[]

  @ManyToMany(() => AutoApplicability, autoApplicability => autoApplicability.details,
      {cascade: true})
  @JoinTable()
  autoApplicability: AutoApplicability[]

  @ManyToMany(() => KeyWords, keyWords => keyWords.detail,
      {cascade: true})
  @JoinTable()
  keyWords: KeyWords[]

  @OneToMany(() => CartItem, cartItem => cartItem.detail)
  cartItem: CartItem[]

  @OneToMany(() => WaitingItem, waitingItem => waitingItem.detail)
  waitingItem: WaitingItem[]

}
