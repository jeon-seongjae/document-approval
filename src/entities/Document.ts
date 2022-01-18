import { ApiProperty } from '@nestjs/swagger';
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

import { Pending } from './Pending';
import { Users } from './Users';

@Entity({ schema: 'Kakao', name: 'document' })
export class Document {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 30 })
  title: string;

  @Column('mediumtext', { name: 'content' })
  content: string;

  @Column('varchar', { name: 'status', length: 100, default: 'OUTBOX' })
  status: string;

  @Column('boolean', { name: 'approval', default: null })
  approval: boolean;

  @Column('int', { name: 'userId', nullable: true })
  userId: number | null;

  @Column('boolean', { name: 'deleted', default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Pending, (pending) => pending.document)
  pending: Pending[];

  @ManyToOne(() => Users, (users) => users.document, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  users: Users;
}
