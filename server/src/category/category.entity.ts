import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductGroup } from './product-group/product-group.entity';
import { Detail } from '../details/entity/detail.entity';

@Entity()
export class Category {

  @PrimaryColumn()
  id: string

  @Column()
  categoryName: string

  @ManyToOne(() => ProductGroup, (productGroup: ProductGroup) => productGroup.category,
    {onDelete: 'CASCADE', eager: true})
  productGroup: ProductGroup

  @OneToMany(() => Detail, (detail: Detail) => detail.category)
  detail: Detail[]

}
