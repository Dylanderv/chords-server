import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
import { Instrument } from "./Instrument";

@Entity('chord')
export class Chord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text', nullable: false})
  key: string;

  @Column({type: 'text', nullable: false})
  suffix: string;

  @Column({type: 'json', nullable: false})
  position: string;

  @Column({type: 'json', nullable: true})
  info: string;

  @ManyToOne(type => Instrument, instrument => instrument.chords)
  instrument: Instrument;
}