import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/entities/Document';
import { Users } from 'src/entities/Users';
import { Pending } from 'src/entities/Pending';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Users, Pending])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
