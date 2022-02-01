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

  @ManyToOne(() => Manufacturer, manufacturer => manufacturer.photoCertificate,
      {onDelete: "CASCADE"})
  manufacturer: Manufacturer

}
