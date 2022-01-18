import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Document } from './Document';
import { Pending } from './Pending';

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'Kakao', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsEmail()
  @ApiProperty({
    example: 'test@gmail.com',
    description: '이메일',
    required: true,
  })
  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test',
    description: '비밀번호',
    required: true,
  })
  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'jeon',
    description: '닉네임',
    required: true,
  })
  @Column('varchar', { name: 'nickname', unique: true, length: 30 })
  nickname: string;

  @Column('boolean', { name: 'deleted', default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Document, (document) => document.users)
  document: Document[];

  @OneToMany(() => Pending, (pending) => pending.users)
  pending: Pending[];
}
