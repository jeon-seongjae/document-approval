import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Document } from './Document';
import { Users } from './Users';

@Entity({ schema: 'Kakao', name: 'pending' })
export class Pending {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'pass or reject',
    description: '승인 여부',
    required: true,
  })
  @Column('varchar', { name: 'status', length: 30, default: 'pending' })
  status: string;

  @IsString()
  @ApiProperty({
    example: '좋네요',
    description: '남기고 싶은 말',
    required: true,
  })
  @Column('varchar', { name: 'comment', length: 255, default: null })
  comment: string | null;

  @Column('int', { name: 'approverId', nullable: true })
  approverId: number | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: '문서 고유 아이디',
    required: true,
  })
  @Column('int', { name: 'documentId', nullable: true })
  documentId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.pending, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'approverId', referencedColumnName: 'id' }])
  users: Users;

  @ManyToOne(() => Document, (document) => document.pending, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'documentId', referencedColumnName: 'id' }])
  document: Document;
}
