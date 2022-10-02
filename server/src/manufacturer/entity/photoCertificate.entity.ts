import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Manufacturer } from './manufacturer.entity';
import {Exclude} from "class-transformer";

@Entity()
export class PhotoCertificate {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  certificatePhotoUrl: string

  @Exclude()
  @Column()
  certificatePhotoKey: string

  // Буленовское значение для выяснения какого вида картинка и связь для объединенния картинок с низким разрешением и высоким

  // @Column({default: false})
  // lowResolution: boolean
  //
  // @Column()
  // relations: number

  @ManyToOne(() => Manufacturer, manufacturer => manufacturer.photoCertificate,
      {onDelete: "CASCADE"})
  manufacturer: Manufacturer

}
