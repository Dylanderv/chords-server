import { PrimaryGeneratedColumn, OneToMany, ManyToMany, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm"

@Entity('partition')
export class Partition {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
