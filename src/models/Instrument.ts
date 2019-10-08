import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Chord } from "./Chord";
import { Partition } from "./Partition";

@Entity('instrument')
export class Instrument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text', nullable: false })
  name: string;

  @Column({type: 'json', nullable: true})
  infos: any;

  @Column({type: 'text', array: true, nullable: false})
  keys: string[]

  @Column({type: 'text', array: true, nullable: false})
  suffixes: string[];

  @OneToMany(type => Chord, chord => chord.instrument)
  chords: Chord[];

  @OneToMany(type => Partition, partition => partition.instrument)
  partitions: Partition[];
}