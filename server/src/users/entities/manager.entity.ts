import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user.entity';

@Entity()
export class Manager {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  fullName: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column({nullable: true})
  additionalPhone: string

  @ManyToOne(() => User, (user: User) => user.manager,
      {onDelete: "CASCADE"})
  user: User


}
