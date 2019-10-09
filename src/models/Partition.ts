import { PrimaryGeneratedColumn, OneToMany, ManyToMany, CreateDateColumn, UpdateDateColumn, Entity, JoinTable, Column, ManyToOne } from "typeorm"
import { Chord } from "./Chord";
import { User } from "./user";
import { Instrument } from "./Instrument";

export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

@Entity('partition')
export class Partition {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(type => Chord)
  @JoinTable()
  chords: Chord[];

  @Column({type: 'text'})
  content: string;

  @Column({type: 'text', nullable: false })
  name: string;

  @ManyToOne(type => User, user => user.partitions)
  owner: User;

  @Column({type: 'enum', enum: Visibility})
  visibility: Visibility;

  @ManyToOne(type => Instrument, instrument => instrument.partitions)
  instrument: Instrument;

}
