import { Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';
import { Category } from '../category.entity';

@Entity()
export class ProductGroup {
  @PrimaryColumn()
  id: string

  @Column({unique: true})
  productGroup: string

  @OneToMany(() => Category, (category: Category) => category.productGroup)
  category: Category[]
}
