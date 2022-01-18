import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @ApiProperty({
    example: 'title',
    description: '제목',
    required: true,
  })
  public title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'content',
    description: '문서내용',
    required: true,
  })
  public content: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: ['tjs@gag.com', 'daff@gag.com', 'test@saf.com'],
    description: '결재자 이메일, 결재 순서대로 넣어주세요!',
    required: true,
  })
  public approver: string[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: '작성자 고유 아이디',
    required: true,
  })
  public userId: number;
}
