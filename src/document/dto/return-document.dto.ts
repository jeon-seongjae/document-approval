import { ApiProperty, PickType } from '@nestjs/swagger';
import { Document } from 'src/entities/Document';
import { Pending } from 'src/entities/Pending';

export class ReturnDocumentDto {
  @ApiProperty({
    example: 'title',
  })
  public title: string;

  @ApiProperty({
    example: 'content',
  })
  public content: string;

  @ApiProperty({
    example: `OUTBOX, ARCHIVE`,
    description: '승인여부',
    required: true,
  })
  public status: string;

  @ApiProperty({
    example: `null, true, false`,
    description: '승인여부',
    required: true,
  })
  public approver: boolean[];

  @ApiProperty({
    example: 1,
    description: '작성자 고유 아이디',
    required: true,
  })
  public userId: number;

  @ApiProperty({
    example: `true, false`,
    description: '삭제여부',
    required: true,
  })
  public deleted: boolean;

  @ApiProperty({
    example: `2021-12-19T17:26:54.863Z`,
    description: '생성일',
    required: true,
  })
  public createdAt: string;

  @ApiProperty({
    example: `2021-12-19T17:26:54.863Z`,
    description: '수정일',
    required: true,
  })
  public updatedAt: string;
}
