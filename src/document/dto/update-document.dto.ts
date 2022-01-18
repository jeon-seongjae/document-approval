import { PickType } from '@nestjs/swagger';
import { Pending } from 'src/entities/Pending';

export class UpdatePendingDto extends PickType(Pending, [
  'id',
  'comment',
  'status',
  'documentId',
] as const) {}
