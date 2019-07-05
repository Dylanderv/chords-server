import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

import {Length, IsEmail} from 'class-validator'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'text', unique: true})
  username: string;

  @Column({type: 'text', nullable: true})
  @Length(5, 100)
  @IsEmail()
  email: string;

  @Column('text')
  hashedPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  role: string;
}