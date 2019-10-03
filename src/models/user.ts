import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

import {Length, IsEmail} from 'class-validator'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text', unique: true, nullable: false, })
  @Length(2, 100)
  username: string;

  @Column({type: 'text', nullable: true})
  // @Length(5, 100)
  // @IsEmail()
  email: string;

  @Column('text')
  @Length(2)
  hashedPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  role: string;
}
